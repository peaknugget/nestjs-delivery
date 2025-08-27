import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class TokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('🔖1.TokenGuard :');
    const request = context.switchToHttp().getRequest();
    console.log('🔖2.TokenGuard  user:', request.user);
    return !!request.user;
  }
}
