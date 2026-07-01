import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { BASE_URL } from '../../../core/api.config';
import { Cart } from '../../../core/models/cart.model';
import { User } from '../../../core/models/user.model';
import { CartDetail } from './cart-detail';

function makeCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 1,
    products: [
      {
        id: 101,
        title: 'Product A',
        price: 10,
        quantity: 2,
        total: 20,
        discountPercentage: 0,
        discountedTotal: 20,
        thumbnail: 'a.png',
      },
      {
        id: 102,
        title: 'Product B',
        price: 5,
        quantity: 1,
        total: 5,
        discountPercentage: 0,
        discountedTotal: 5,
        thumbnail: 'b.png',
      },
    ],
    total: 25,
    discountedTotal: 25,
    userId: 7,
    totalProducts: 2,
    totalQuantity: 3,
    ...overrides,
  };
}

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 7,
    username: 'jdoe',
    email: 'jdoe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'female',
    image: 'jdoe.png',
    ...overrides,
  };
}

describe('CartDetail', () => {
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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('renders embedded products without any extra /products/* fetch, and fetches the owner exactly once', async () => {
    const fixture = TestBed.createComponent(CartDetail);
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();

    const cartReq = httpMock.expectOne(`${BASE_URL}/carts/1`);
    cartReq.flush(makeCart());
    await fixture.whenStable();

    // Exactly one owner fetch, no per-product fetches.
    const userReq = httpMock.expectOne(`${BASE_URL}/users/7`);
    httpMock.expectNone(`${BASE_URL}/products/101`);
    httpMock.expectNone(`${BASE_URL}/products/102`);
    userReq.flush(makeUser());
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Product A');
    expect(text).toContain('Product B');
    expect(text).toContain('Jane');

    // Still no product fetches were ever made.
    httpMock.expectNone(`${BASE_URL}/products/101`);
    httpMock.expectNone(`${BASE_URL}/products/102`);

    const productLinks = (fixture.nativeElement as HTMLElement).querySelectorAll('a[href="/products/101"], a[href="/products/102"]');
    expect(productLinks.length).toBe(2);

    const ownerLink = (fixture.nativeElement as HTMLElement).querySelector('a[href="/users/7"]');
    expect(ownerLink).toBeTruthy();
  });

  it('re-fetches cart and owner fully when id() changes (route-param reuse)', async () => {
    const fixture = TestBed.createComponent(CartDetail);
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();

    httpMock.expectOne(`${BASE_URL}/carts/1`).flush(makeCart({ id: 1, userId: 7 }));
    await fixture.whenStable();
    httpMock.expectOne(`${BASE_URL}/users/7`).flush(makeUser({ id: 7, firstName: 'Jane' }));
    await fixture.whenStable();

    let text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Cart #1');
    expect(text).toContain('Jane');

    // Simulate the router reusing this component instance for /carts/2.
    fixture.componentRef.setInput('id', '2');
    await fixture.whenStable();

    const secondCart = makeCart({
      id: 2,
      userId: 9,
      products: [
        {
          id: 201,
          title: 'Product C',
          price: 30,
          quantity: 1,
          total: 30,
          discountPercentage: 0,
          discountedTotal: 30,
          thumbnail: 'c.png',
        },
      ],
      totalProducts: 1,
      totalQuantity: 1,
      total: 30,
      discountedTotal: 30,
    });

    httpMock.expectOne(`${BASE_URL}/carts/2`).flush(secondCart);
    await fixture.whenStable();
    httpMock.expectOne(`${BASE_URL}/users/9`).flush(makeUser({ id: 9, firstName: 'Bob' }));
    await fixture.whenStable();

    text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Cart #2');
    expect(text).toContain('Product C');
    expect(text).toContain('Bob');
    expect(text).not.toContain('Product A');
  });
});
