import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { BASE_URL } from '../../../core/api.config';
import { Product } from '../../../core/models/product.model';
import { ProductDetail } from './product-detail';

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: 1,
    title: 'Product',
    description: 'desc',
    category: 'smartphones',
    price: 10,
    discountPercentage: 0,
    rating: 4.5,
    stock: 10,
    tags: [],
    sku: 'sku',
    weight: 1,
    dimensions: { width: 1, height: 1, depth: 1 },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: 'In Stock',
    reviews: [],
    returnPolicy: '',
    minimumOrderQuantity: 1,
    meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
    thumbnail: 't.png',
    images: [],
    ...overrides,
  };
}

describe('ProductDetail', () => {
  let fixture: ComponentFixture<ProductDetail>;
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
    fixture = TestBed.createComponent(ProductDetail);
    fixture.componentRef.setInput('id', '1');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches and renders the product for the initial id', async () => {
    await fixture.whenStable();

    const req = httpMock.expectOne(`${BASE_URL}/products/1`);
    req.flush(makeProduct({ id: 1, title: 'Product One' }));

    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Product One');
  });

  it('re-fetches and swaps data when id changes on a reused component instance', async () => {
    await fixture.whenStable();

    const req1 = httpMock.expectOne(`${BASE_URL}/products/1`);
    req1.flush(makeProduct({ id: 1, title: 'Product One' }));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Product One');

    // Simulate route reuse: navigating /products/1 -> /products/2 rebinds the
    // same `id` input rather than destroying/recreating the component.
    fixture.componentRef.setInput('id', '2');
    await fixture.whenStable();

    const req2 = httpMock.expectOne(`${BASE_URL}/products/2`);
    req2.flush(makeProduct({ id: 2, title: 'Product Two' }));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Product Two');
    expect(fixture.nativeElement.textContent).not.toContain('Product One');
  });

  it('clicking the category chip navigates to /products filtered by that category', async () => {
    await fixture.whenStable();

    const req = httpMock.expectOne(`${BASE_URL}/products/1`);
    req.flush(makeProduct({ id: 1, title: 'Product One', category: 'smartphones' }));
    await fixture.whenStable();

    const chip: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
    expect(chip).toBeTruthy();
    chip!.click();

    expect(router.navigate).toHaveBeenCalledWith(['/products'], {
      queryParams: { category: 'smartphones' },
    });
  });
});
