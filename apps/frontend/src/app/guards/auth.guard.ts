import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { lastValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const AuthGuard: CanActivateFn = async (): Promise<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return false;

  const authenticated = await lastValueFrom(authService.isLoggedIn());
  if (!authenticated) router.navigate(['/login']);
  return authenticated;
};
