import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BASE_URL } from '../api.config';
import { Cart, CartsResponse } from '../models/cart.model';

export interface CartListParams {
  limit?: number;
  skip?: number;
}

/**
 * Thin HTTP wrapper around DummyJSON's `/carts` resource. Carts embed their
 * full `products[]` payload (see REWRITE-PLAN.md §5b), so no per-product
 * fetch is ever needed here — only the owning user is a bare FK (`userId`)
 * and is resolved separately by the caller with a single `/users/{id}` call.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);

  list(params: CartListParams = {}): Observable<CartsResponse> {
    let httpParams = new HttpParams();
    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit);
    }
    if (params.skip !== undefined) {
      httpParams = httpParams.set('skip', params.skip);
    }

    return this.http.get<CartsResponse>(`${BASE_URL}/carts`, { params: httpParams });
  }

  getById(id: string | number): Observable<Cart> {
    return this.http.get<Cart>(`${BASE_URL}/carts/${id}`);
  }
}
