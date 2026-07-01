import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ACCESS_TOKEN_KEY } from '../services/auth.service';

/**
 * Route guard that allows navigation only when an access token is present
 * (a synchronous, non-blocking check — it does not wait on `/auth/me`).
 * Redirects to /login preserving the attempted URL as `returnUrl` otherwise.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
