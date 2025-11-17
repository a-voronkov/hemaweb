import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { createLucia } from './lucia';
import { VerificationService } from './verification.service';
import type { User, Session } from 'lucia';

@Injectable()
export class AuthService {
  private lucia: ReturnType<typeof createLucia>;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private verificationService: VerificationService,
  ) {
    this.lucia = createLucia(this.prisma);
  }

  /**
   * Register a new user (donor)
   */
  async register(email: string, password: string, firstName: string, lastName: string, phone: string) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Get donor role
    const donorRole = await this.prisma.userRoleRef.findUnique({
      where: { code: 'donor' },
    });

    if (!donorRole) {
      throw new BadRequestException('Donor role not found');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: donorRole.id,
        isActive: true,
        isVerified: false,
        profile: {
          create: {
            firstName,
            lastName,
            phone,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Send verification email
    try {
      await this.verificationService.sendVerificationEmail(user.id);
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send verification email:', error);
    }

    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: User; session: Session }> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Create session
    const session = await this.lucia.createSession(user.id, {});
    
    return {
      user: {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        isActive: user.isActive,
        isVerified: user.isVerified,
      } as User,
      session,
    };
  }

  /**
   * Logout user
   */
  async logout(sessionId: string): Promise<void> {
    await this.lucia.invalidateSession(sessionId);
  }

  /**
   * Validate session
   */
  async validateSession(sessionId: string) {
    const result = await this.lucia.validateSession(sessionId);
    return result;
  }

  /**
   * Get session cookie
   */
  createSessionCookie(sessionId: string) {
    return this.lucia.createSessionCookie(sessionId);
  }

  /**
   * Get blank session cookie (for logout)
   */
  createBlankSessionCookie() {
    return this.lucia.createBlankSessionCookie();
  }
}

