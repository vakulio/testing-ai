import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BASE_URL } from '../api.config';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('list() GETs /comments with limit/skip params', () => {
    service.list({ limit: 10, skip: 20 }).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/comments?limit=10&skip=20`);
    expect(req.request.method).toBe('GET');
    req.flush({ comments: [], total: 0, skip: 20, limit: 10 });
  });

  it('list() with no params GETs bare /comments', () => {
    service.list().subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/comments`);
    expect(req.request.method).toBe('GET');
    req.flush({ comments: [], total: 0, skip: 0, limit: 30 });
  });
});
