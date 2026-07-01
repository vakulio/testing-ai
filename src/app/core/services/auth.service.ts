import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, shareReplay, tap, throwError } from 'rxjs';

import { BASE_URL } from '../api.config';
import { LoginResponse } from '../models/auth.model';
import { User } from '../models/user.model';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Owns authentication state and the single-flight token-refresh machinery.
 *
 * A functional interceptor is stateless per request, so the shared `refresh$`
 * slot lives here: N concurrent 401s all await the SAME in-flight
 * `/auth/refresh` (see {@link getRefreshObservable}). State restore is
 * fire-and-forget from an `effect()` so a slow/down sandbox never blocks paint.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /** Currently authenticated user, hydrated from login or `/auth/me`. */
  readonly currentUser = signal<User | null>(null);

  /** The one shared in-flight refresh, or `null` when no refresh is running. */
  private refresh$: Observable<string> | null = null;

  private restored = false;

  constructor() {
    // Fire-and-forget session restore. Reads no signals, so it runs exactly
    // once; guarded + flushed off the constructor so the interceptor can
    // resolve this fully-constructed instance without a circular DI hit.
    effect(() => {
      if (this.restored) {
        return;
      }
      this.restored = true;
      this.restoreSession();
    });
  }

  /**
   * Authenticate against DummyJSON. On success stores both tokens and sets the
   * `currentUser` signal. Returns the response Observable for the caller.
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${BASE_URL}/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
          this.currentUser.set(res);
        }),
      );
  }

  /**
   * Clear the session and bounce to `/login`, preserving the current URL as
   * `returnUrl`. Safe to call outside the guard (e.g. from an async refresh
   * failure mid-navigation).
   */
  logout(): void {
    const returnUrl = this.router.url;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
  }

  /**
   * Single-flight refresh. If a refresh is already in flight, hands back the
   * SAME shared Observable so concurrent 401s trigger exactly one
   * `/auth/refresh`. On success stores the new access (and refresh) token and
   * resets the slot; on failure logs out and resets the slot.
   */
  getRefreshObservable(): Observable<string> {
    if (this.refresh$) {
      return this.refresh$;
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    this.refresh$ = this.http
      .post<RefreshResponse>(`${BASE_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
          if (res.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
          }
        }),
        map((res) => res.accessToken),
        catchError((err: unknown) => {
          this.logout();
          return throwError(() => err);
        }),
        // Reset the slot after the flight settles (success or failure) so a
        // future 401 can start a fresh refresh.
        finalize(() => {
          this.refresh$ = null;
        }),
        shareReplay(1),
      );

    return this.refresh$;
  }

  private restoreSession(): void {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      return;
    }
    // Bearer header is attached by the interceptor. A 401 here rides the normal
    // refresh flow; we deliberately do not special-case it.
    this.http.get<User>(`${BASE_URL}/auth/me`).subscribe({
      next: (user) => this.currentUser.set(user),
      error: () => {
        /* interceptor handles refresh / logout */
      },
    });
  }
}
