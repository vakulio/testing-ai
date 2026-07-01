import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { authInterceptor } from '../interceptors/auth.interceptor';
import { BASE_URL } from '../api.config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: { url: string; navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    router = { url: '/products/7', navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    // Flush the fire-and-forget restore effect while no token exists (no-op).
    TestBed.inject(ApplicationRef).tick();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('login() POSTs credentials, stores tokens and sets currentUser', () => {
    service.login('emilys', 'emilyspass').subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'emilys', password: 'emilyspass' });

    req.flush({
      id: 1,
      username: 'emilys',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'img',
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    });

    expect(localStorage.getItem('accessToken')).toBe('access-1');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-1');
    expect(service.currentUser()?.username).toBe('emilys');
  });

  it('logout() clears storage, resets currentUser and navigates with returnUrl', () => {
    localStorage.setItem('accessToken', 'access-1');
    localStorage.setItem('refreshToken', 'refresh-1');
    service.currentUser.set({
      id: 1,
      username: 'emilys',
      email: 'e',
      firstName: 'E',
      lastName: 'J',
      gender: 'female',
      image: 'img',
    });

    service.logout();

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/products/7' },
    });
  });

  it('refresh failure triggers logout()', () => {
    localStorage.setItem('accessToken', 'stale');
    localStorage.setItem('refreshToken', 'stale-refresh');

    service.getRefreshObservable().subscribe({ error: () => {} });

    const req = httpMock.expectOne(`${BASE_URL}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'stale-refresh' });

    req.flush('nope', { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/products/7' },
    });
  });
});
