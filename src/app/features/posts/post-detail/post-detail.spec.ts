import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BASE_URL } from '../../../core/api.config';
import { CommentsResponse } from '../../../core/models/comment.model';
import { Post } from '../../../core/models/post.model';
import { User } from '../../../core/models/user.model';
import { PostDetail } from './post-detail';

function makePost(id: number, userId: number): Post {
  return {
    id,
    title: `Post ${id}`,
    body: `Body of post ${id}`,
    userId,
    tags: ['tag'],
    reactions: { likes: 1, dislikes: 0 },
    views: 10,
  };
}

function makeUser(id: number): User {
  return {
    id,
    username: `user${id}`,
    email: `user${id}@example.com`,
    firstName: `First${id}`,
    lastName: `Last${id}`,
    gender: 'female',
    image: 'img',
  };
}

function makeComments(postId: number): CommentsResponse {
  return {
    comments: [
      {
        id: 100 + postId,
        body: `Comment on post ${postId}`,
        postId,
        likes: 2,
        user: {
          id: 900 + postId,
          username: `commenter${postId}`,
          fullName: `Commenter ${postId}`,
        },
      },
    ],
    total: 1,
    skip: 0,
    limit: 10,
  };
}

describe('PostDetail', () => {
  let fixture: ComponentFixture<PostDetail>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PostDetail);
    fixture.componentRef.setInput('id', '1');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('renders post, author (single fetch) and embedded comment authors with NO per-comment /users/ call', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    httpMock.expectOne(`${BASE_URL}/posts/1`).flush(makePost(1, 5));
    httpMock.expectOne(`${BASE_URL}/posts/1/comments`).flush(makeComments(1));
    await fixture.whenStable();

    // Exactly ONE /users/ request total: the post-author fetch. No
    // per-comment request is issued even though the response includes a
    // comment with its own embedded user (id 905).
    const userRequests = httpMock.match((req) => req.url.startsWith(`${BASE_URL}/users/`));
    expect(userRequests.length).toBe(1);
    expect(userRequests[0].request.url).toBe(`${BASE_URL}/users/5`);
    userRequests[0].flush(makeUser(5));
    await fixture.whenStable();

    httpMock.expectNone(`${BASE_URL}/users/905`);

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Post 1');
    expect(text).toContain('Body of post 1');
    expect(text).toContain('First5 Last5');
    expect(text).toContain('Comment on post 1');
    expect(text).toContain('Commenter 1');

    // --- Route-param reload: navigating /posts/1 -> /posts/2 reuses this
    // component instance; changing the `id` input must trigger a full
    // re-fetch (post, comments, and a fresh single author fetch).
    fixture.componentRef.setInput('id', '2');
    await fixture.whenStable();

    httpMock.expectOne(`${BASE_URL}/posts/2`).flush(makePost(2, 6));
    httpMock.expectOne(`${BASE_URL}/posts/2/comments`).flush(makeComments(2));
    await fixture.whenStable();

    const secondUserRequests = httpMock.match((req) => req.url.startsWith(`${BASE_URL}/users/`));
    expect(secondUserRequests.length).toBe(1);
    expect(secondUserRequests[0].request.url).toBe(`${BASE_URL}/users/6`);
    secondUserRequests[0].flush(makeUser(6));
    await fixture.whenStable();

    const updatedText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(updatedText).toContain('Post 2');
    expect(updatedText).toContain('Body of post 2');
    expect(updatedText).toContain('First6 Last6');
    expect(updatedText).toContain('Comment on post 2');
    expect(updatedText).toContain('Commenter 2');
    expect(updatedText).not.toContain('Post 1');
  });
});
