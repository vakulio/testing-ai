import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { BASE_URL } from '../api.config';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    // Construct AuthService and flush its restore effect while no token exists,
    // so the fire-and-forget /auth/me never interferes with these expectations.
    TestBed.inject(AuthService);
    TestBed.inject(ApplicationRef).tick();

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('attaches the Bearer token to BASE_URL requests', () => {
    localStorage.setItem('accessToken', 'abc');

    http.get(`${BASE_URL}/products`).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/products`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
  });

  it('does not attach a token to non-BASE_URL requests', () => {
    localStorage.setItem('accessToken', 'abc');

    http.get('https://example.com/data').subscribe();

    const req = httpMock.expectOne('https://example.com/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('skips /auth/login and /auth/refresh', () => {
    localStorage.setItem('accessToken', 'abc');

    http.post(`${BASE_URL}/auth/login`, {}).subscribe();
    http.post(`${BASE_URL}/auth/refresh`, {}).subscribe();

    const login = httpMock.expectOne(`${BASE_URL}/auth/login`);
    const refresh = httpMock.expectOne(`${BASE_URL}/auth/refresh`);
    expect(login.request.headers.has('Authorization')).toBe(false);
    expect(refresh.request.headers.has('Authorization')).toBe(false);
    login.flush({});
    refresh.flush({});
  });

  it('on N concurrent 401s triggers exactly ONE refresh and retries each with the NEW token', () => {
    localStorage.setItem('accessToken', 'old');
    localStorage.setItem('refreshToken', 'r-old');

    const results: unknown[] = [];
    for (let i = 0; i < 3; i++) {
      http.get(`${BASE_URL}/auth/me`).subscribe((res) => results.push(res));
    }

    // All three initial probes 401 with the stale token.
    const initial = httpMock.match(`${BASE_URL}/auth/me`);
    expect(initial.length).toBe(3);
    initial.forEach((r) => {
      expect(r.request.headers.get('Authorization')).toBe('Bearer old');
      r.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    // Exactly one refresh call is made for all three concurrent 401s.
    const refresh = httpMock.expectOne(`${BASE_URL}/auth/refresh`);
    refresh.flush({ accessToken: 'new', refreshToken: 'r-new' });

    // All three original requests are retried, each carrying the NEW token.
    const retried = httpMock.match(`${BASE_URL}/auth/me`);
    expect(retried.length).toBe(3);
    retried.forEach((r, i) => {
      expect(r.request.headers.get('Authorization')).toBe('Bearer new');
      r.flush({ id: i });
    });

    expect(results.length).toBe(3);
    expect(localStorage.getItem('accessToken')).toBe('new');
  });

  it('does not trigger a second refresh when a retried request 401s again (bounded retry = 1)', () => {
    localStorage.setItem('accessToken', 'old');
    localStorage.setItem('refreshToken', 'r-old');

    let capturedError: unknown = null;
    http.get(`${BASE_URL}/auth/me`).subscribe({
      error: (err) => {
        capturedError = err;
      },
    });

    httpMock.expectOne(`${BASE_URL}/auth/me`).flush('unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });

    httpMock
      .expectOne(`${BASE_URL}/auth/refresh`)
      .flush({ accessToken: 'new', refreshToken: 'r-new' });

    // Retried request 401s again -> error propagates, no second refresh.
    const retried = httpMock.expectOne(`${BASE_URL}/auth/me`);
    expect(retried.request.headers.get('Authorization')).toBe('Bearer new');
    retried.flush('still unauthorized', { status: 401, statusText: 'Unauthorized' });

    httpMock.expectNone(`${BASE_URL}/auth/refresh`);
    expect(capturedError).toBeTruthy();
  });
});
