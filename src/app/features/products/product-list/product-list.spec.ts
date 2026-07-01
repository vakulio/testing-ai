import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { BASE_URL } from '../../../core/api.config';
import { ProductList } from './product-list';

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;
  let httpMock: HttpTestingController;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductList);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushCategories(): void {
    httpMock.expectOne(`${BASE_URL}/products/category-list`).flush(['smartphones', 'laptops']);
  }

  it('shows a loading state while the initial fetch is in flight', async () => {
    await fixture.whenStable();
    flushCategories();

    expect(fixture.nativeElement.querySelector('app-loading-spinner')).toBeTruthy();

    httpMock.expectOne((r) => r.url === `${BASE_URL}/products`).flush({
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    });
    await fixture.whenStable();
  });

  it('shows an error state when the fetch fails', async () => {
    await fixture.whenStable();
    flushCategories();

    httpMock
      .expectOne((r) => r.url === `${BASE_URL}/products`)
      .flush('boom', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-error-message')).toBeTruthy();
  });

  it('shows an empty state when the list has no results', async () => {
    await fixture.whenStable();
    flushCategories();

    httpMock.expectOne((r) => r.url === `${BASE_URL}/products`).flush({
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('re-fetches via /products/search when the search box emits a query', async () => {
    await fixture.whenStable();
    flushCategories();

    httpMock.expectOne((r) => r.url === `${BASE_URL}/products`).flush({
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    });
    await fixture.whenStable();

    fixture.componentInstance.onQueryChange('phone');
    await fixture.whenStable();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}/products/search`);
    expect(req.request.params.get('q')).toBe('phone');
    req.flush({ products: [], total: 0, skip: 0, limit: 12 });
    await fixture.whenStable();
  });
});
