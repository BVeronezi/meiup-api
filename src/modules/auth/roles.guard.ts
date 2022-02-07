import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const TipoUsuario = request.user.tipo;
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    if (!requiredRole) return true;

    return TipoUsuario === requiredRole;
  }
}
