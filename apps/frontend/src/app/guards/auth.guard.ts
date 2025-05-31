import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedIn().pipe(
    tap((loggedIn) => {
      if (!loggedIn) {
        router.navigate(['login']);
      }
    }),
    map((loggedIn) => loggedIn),
  );
};
