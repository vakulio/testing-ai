import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BASE_URL } from '../api.config';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('list() with no filters GETs /products with limit/skip params', () => {
    service.list({ limit: 12, skip: 24 }).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${BASE_URL}/products`,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('limit')).toBe('12');
    expect(req.request.params.get('skip')).toBe('24');
    req.flush({ products: [], total: 0, skip: 24, limit: 12 });
  });

  it('list() with q hits /products/search?q=', () => {
    service.list({ limit: 12, skip: 0, q: 'phone' }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}/products/search`);
    expect(req.request.params.get('q')).toBe('phone');
    expect(req.request.params.get('limit')).toBe('12');
    req.flush({ products: [], total: 0, skip: 0, limit: 12 });
  });

  it('list() with category (no q) hits /products/category/{cat}', () => {
    service.list({ limit: 12, skip: 0, category: 'smartphones' }).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${BASE_URL}/products/category/smartphones`,
    );
    expect(req.request.method).toBe('GET');
    req.flush({ products: [], total: 0, skip: 0, limit: 12 });
  });

  it('list() prefers q over category when both are provided', () => {
    service.list({ q: 'phone', category: 'smartphones' }).subscribe();

    httpMock.expectOne((r) => r.url === `${BASE_URL}/products/search`);
  });

  it('getById() GETs /products/{id}', () => {
    service.getById(7).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/products/7`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('categories() GETs /products/category-list', () => {
    service.categories().subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/products/category-list`);
    expect(req.request.method).toBe('GET');
    req.flush(['smartphones', 'laptops']);
  });
});
