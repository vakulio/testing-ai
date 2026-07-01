import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BASE_URL } from '../api.config';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('list() GETs /users with limit/skip params when no query is given', () => {
    service.list({ limit: 12, skip: 0 }).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/users?limit=12&skip=0`);
    expect(req.request.method).toBe('GET');
    req.flush({ users: [], total: 0, skip: 0, limit: 12 });
  });

  it('list() GETs /users/search?q= when a query is provided', () => {
    service.list({ limit: 12, skip: 0, q: 'emily' }).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/users/search?q=emily&limit=12&skip=0`);
    expect(req.request.method).toBe('GET');
    req.flush({ users: [], total: 0, skip: 0, limit: 12 });
  });

  it('getById() GETs /users/{id}', () => {
    service.getById(1).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 1,
      username: 'emilys',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'img',
    });
  });

  it('postsByUser() GETs /posts/user/{userId}', () => {
    service.postsByUser(1).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/posts/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ posts: [], total: 0, skip: 0, limit: 0 });
  });

  it('cartsByUser() GETs /users/{userId}/carts', () => {
    service.cartsByUser(1).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/users/1/carts`);
    expect(req.request.method).toBe('GET');
    req.flush({ carts: [], total: 0, skip: 0, limit: 0 });
  });
});
