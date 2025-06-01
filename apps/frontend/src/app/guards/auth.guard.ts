import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, lastValueFrom, map, timer } from 'rxjs';

export const AuthGuard: CanActivateFn = async (route, state): Promise<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const authenticated = await lastValueFrom(authService.isLoggedIn());
  if (!authenticated) router.navigate(['/login']);
  return authenticated;
};
