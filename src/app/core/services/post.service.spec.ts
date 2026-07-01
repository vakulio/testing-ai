import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BASE_URL } from '../api.config';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('list() without a query GETs /posts with limit/skip params', () => {
    service.list({ limit: 10, skip: 20 }).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/posts?limit=10&skip=20`);
    expect(req.request.method).toBe('GET');
    req.flush({ posts: [], total: 0, skip: 20, limit: 10 });
  });

  it('list() with a query GETs /posts/search?q= instead of /posts', () => {
    service.list({ q: 'love', limit: 30, skip: 0 }).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/posts/search?limit=30&skip=0&q=love`);
    expect(req.request.method).toBe('GET');
    req.flush({ posts: [], total: 0, skip: 0, limit: 30 });
  });

  it('list() with no params GETs bare /posts', () => {
    service.list().subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/posts`);
    expect(req.request.method).toBe('GET');
    req.flush({ posts: [], total: 0, skip: 0, limit: 30 });
  });

  it('getById() GETs /posts/{id}', () => {
    service.getById(1).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/posts/1`);
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 1,
      title: 't',
      body: 'b',
      userId: 5,
      tags: [],
      reactions: { likes: 0, dislikes: 0 },
      views: 0,
    });
  });

  it('commentsByPost() GETs /posts/{id}/comments', () => {
    service.commentsByPost(1).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/posts/1/comments`);
    expect(req.request.method).toBe('GET');
    req.flush({ comments: [], total: 0, skip: 0, limit: 10 });
  });
});
