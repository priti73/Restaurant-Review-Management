import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false; // No token, access denied
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; // Attach user data to the request object

      // Get roles allowed for the current route/method
      const allowedRoles = this.reflector.get<Role[]>('roles', context.getHandler());
      console.log(allowedRoles,"alloweroels")
      if (!allowedRoles) {
        return true; // No specific roles defined, access granted
      }

      // Check if the user has any of the allowed roles
      return allowedRoles.some(role => this.hasRole(payload.role, role));
    } catch {
      return false; // Invalid token or verification failed, access denied
    }
  }

  private hasRole(userRole: Role, allowedRole: Role): boolean {
    // Define your role hierarchy and access rules here
    // For example:
    if (userRole === Role.Admin && allowedRole === Role.Admin) {
      return true; // Admin can perform any action
    } else if (userRole === Role.BusinessOwner && allowedRole === Role.BusinessOwner) {
      return true; // Business owner can perform CREATE, READ, UPDATE
    } else if (userRole === Role.User && allowedRole === Role.User) {
      return true; // User can only perform READ
    }
    return false; // Default to access denied
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return undefined; // No Bearer token found
    }
    return authorization.substring(7); // Extract token from 'Bearer <token>'
  }
}
