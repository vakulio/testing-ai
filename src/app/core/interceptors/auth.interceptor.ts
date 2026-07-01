import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { BASE_URL } from '../api.config';
import { ACCESS_TOKEN_KEY, AuthService } from '../services/auth.service';

/** Marks a request that has already been retried once, so it never re-refreshes. */
const RETRIED = new HttpContextToken<boolean>(() => false);

/**
 * Attaches the Bearer token to DummyJSON requests and drives the single-flight
 * 401 -> refresh -> re-clone retry.
 *
 * - Requests outside {@link BASE_URL}, or to `/auth/login` / `/auth/refresh`,
 *   pass through untouched.
 * - On a first 401 the interceptor awaits {@link AuthService.getRefreshObservable}
 *   (shared across concurrent 401s) and retries the ORIGINAL request re-cloned
 *   with the NEW token. Retry is bounded to 1: a re-401 propagates without a
 *   second refresh.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isApiRequest = req.url.startsWith(BASE_URL);
  const isAuthEndpoint =
    req.url.startsWith(`${BASE_URL}/auth/login`) ||
    req.url.startsWith(`${BASE_URL}/auth/refresh`);

  if (!isApiRequest || isAuthEndpoint) {
    return next(req);
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const canRetry =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.context.get(RETRIED);

      if (!canRetry) {
        return throwError(() => error);
      }

      return authService.getRefreshObservable().pipe(
        switchMap((newToken) => {
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` },
            context: req.context.set(RETRIED, true),
          });
          return next(retried);
        }),
      );
    }),
  );
};
