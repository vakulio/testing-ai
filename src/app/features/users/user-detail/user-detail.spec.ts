import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { BASE_URL } from '../../../core/api.config';
import { UserDetail } from './user-detail';

describe('UserDetail', () => {
  let fixture: ComponentFixture<UserDetail>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [UserDetail],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    fixture = TestBed.createComponent(UserDetail);
    fixture.componentRef.setInput('id', '1');
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads the user profile, posts and carts for the bound id and renders correct links', async () => {
    httpMock.expectOne(`${BASE_URL}/users/1`).flush({
      id: 1,
      username: 'emilys',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'img-1',
    });
    httpMock.expectOne(`${BASE_URL}/posts/user/1`).flush({
      posts: [
        {
          id: 10,
          title: 'Post 10',
          body: '',
          userId: 1,
          tags: [],
          reactions: { likes: 0, dislikes: 0 },
          views: 0,
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });
    httpMock.expectOne(`${BASE_URL}/users/1/carts`).flush({
      carts: [
        {
          id: 20,
          products: [],
          total: 0,
          discountedTotal: 0,
          userId: 1,
          totalProducts: 0,
          totalQuantity: 0,
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    await fixture.whenStable();
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Emily Johnson');
    expect(html.textContent).toContain('Post 10');

    const postLink = html.querySelector('a[href="/posts/10"]');
    const cartLink = html.querySelector('a[href="/carts/20"]');
    expect(postLink).toBeTruthy();
    expect(cartLink).toBeTruthy();
  });

  it('re-fetches user, posts and carts when the id input changes (reused component instance)', async () => {
    httpMock.expectOne(`${BASE_URL}/users/1`).flush({
      id: 1,
      username: 'emilys',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'img-1',
    });
    httpMock.expectOne(`${BASE_URL}/posts/user/1`).flush({ posts: [], total: 0, skip: 0, limit: 10 });
    httpMock.expectOne(`${BASE_URL}/users/1/carts`).flush({ carts: [], total: 0, skip: 0, limit: 10 });

    await fixture.whenStable();
    fixture.detectChanges();

    let html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Emily Johnson');

    // Navigate to a different user id on the SAME component instance.
    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();
    await fixture.whenStable();

    httpMock.expectOne(`${BASE_URL}/users/2`).flush({
      id: 2,
      username: 'bobby',
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Smith',
      gender: 'male',
      image: 'img-2',
    });
    httpMock.expectOne(`${BASE_URL}/posts/user/2`).flush({
      posts: [
        {
          id: 99,
          title: 'Post 99',
          body: '',
          userId: 2,
          tags: [],
          reactions: { likes: 0, dislikes: 0 },
          views: 0,
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });
    httpMock.expectOne(`${BASE_URL}/users/2/carts`).flush({
      carts: [
        {
          id: 55,
          products: [],
          total: 0,
          discountedTotal: 0,
          userId: 2,
          totalProducts: 0,
          totalQuantity: 0,
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    await fixture.whenStable();
    fixture.detectChanges();

    html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Bob Smith');
    expect(html.textContent).not.toContain('Emily Johnson');
    expect(html.querySelector('a[href="/posts/99"]')).toBeTruthy();
    expect(html.querySelector('a[href="/carts/55"]')).toBeTruthy();
  });
});
