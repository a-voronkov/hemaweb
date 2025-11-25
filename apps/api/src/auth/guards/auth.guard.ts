import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Get session ID from cookie
    const sessionId = request.cookies['session'];

    if (!sessionId) {
      throw new UnauthorizedException('No session found');
    }

    // Validate session
    const { session, user } = await this.authService.validateSession(sessionId);

    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Attach user and session to request
    request['user'] = user;
    request['session'] = session;

    return true;
  }
}
