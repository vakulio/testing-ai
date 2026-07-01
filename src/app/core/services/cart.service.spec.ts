import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BASE_URL } from '../api.config';
import { Cart, CartsResponse } from '../models/cart.model';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('list() GETs /carts with limit/skip params', () => {
    const response: CartsResponse = { carts: [], total: 0, skip: 5, limit: 10 };

    service.list({ limit: 10, skip: 5 }).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/carts?limit=10&skip=5`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('list() GETs /carts with no params when none given', () => {
    const response: CartsResponse = { carts: [], total: 0, skip: 0, limit: 30 };

    service.list().subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/carts`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('getById() GETs /carts/{id}', () => {
    const cart: Cart = {
      id: 1,
      products: [],
      total: 0,
      discountedTotal: 0,
      userId: 7,
      totalProducts: 0,
      totalQuantity: 0,
    };

    service.getById(1).subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/carts/1`);
    expect(req.request.method).toBe('GET');
    req.flush(cart);
  });
});
