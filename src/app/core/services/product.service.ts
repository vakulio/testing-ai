import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BASE_URL } from '../api.config';
import { Product, ProductsResponse } from '../models/product.model';

export interface ProductListParams {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string | null;
}

/**
 * Owns all `/products` HTTP access. `list()` picks the right DummyJSON
 * endpoint based on which filter is active: a search query takes priority
 * over a category filter, which takes priority over the plain paginated list.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  list(params: ProductListParams = {}): Observable<ProductsResponse> {
    const { limit, skip, q, category } = params;

    let httpParams = new HttpParams();
    if (limit != null) {
      httpParams = httpParams.set('limit', limit);
    }
    if (skip != null) {
      httpParams = httpParams.set('skip', skip);
    }

    if (q) {
      return this.http.get<ProductsResponse>(`${BASE_URL}/products/search`, {
        params: httpParams.set('q', q),
      });
    }

    if (category) {
      return this.http.get<ProductsResponse>(`${BASE_URL}/products/category/${category}`, {
        params: httpParams,
      });
    }

    return this.http.get<ProductsResponse>(`${BASE_URL}/products`, { params: httpParams });
  }

  getById(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${BASE_URL}/products/${id}`);
  }

  categories(): Observable<string[]> {
    return this.http.get<string[]>(`${BASE_URL}/products/category-list`);
  }
}
