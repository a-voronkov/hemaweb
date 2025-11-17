import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new donor account' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.phone,
    );

    return {
      message: 'Registration successful',
      user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login to account' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, session } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    // Set session cookie
    const sessionCookie = this.authService.createSessionCookie(session.id);
    response.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        isVerified: user.isVerified,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from account' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.cookies['session'];
    
    if (sessionId) {
      await this.authService.logout(sessionId);
    }

    // Clear session cookie
    const blankCookie = this.authService.createBlankSessionCookie();
    response.cookie(blankCookie.name, blankCookie.value, blankCookie.attributes);

    return {
      message: 'Logout successful',
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Req() request: Request) {
    return {
      user: request['user'],
    };
  }

  @Get('session')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate current session' })
  @ApiResponse({ status: 200, description: 'Session is valid' })
  @ApiResponse({ status: 401, description: 'Session is invalid' })
  async validateSession(@Req() request: Request) {
    return {
      valid: true,
      session: request['session'],
      user: request['user'],
    };
  }
}

