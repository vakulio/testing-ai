import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BASE_URL } from '../api.config';
import { CartsResponse } from '../models/cart.model';
import { PostsResponse } from '../models/post.model';
import { User, UsersResponse } from '../models/user.model';

export interface UserListParams {
  limit?: number;
  skip?: number;
  q?: string;
}

/**
 * Owns all HTTP access for the users resource plus the cross-linked posts and
 * carts owned by a given user (fetched by their `userId` foreign key).
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  /**
   * Paginated user list. Hits `/users/search?q=` when `q` is provided,
   * otherwise `/users?limit=&skip=`.
   */
  list(params: UserListParams = {}): Observable<UsersResponse> {
    const { limit, skip, q } = params;
    let httpParams = new HttpParams();

    if (q) {
      httpParams = httpParams.set('q', q);
    }
    if (limit !== undefined) {
      httpParams = httpParams.set('limit', limit);
    }
    if (skip !== undefined) {
      httpParams = httpParams.set('skip', skip);
    }

    const path = q ? '/users/search' : '/users';
    return this.http.get<UsersResponse>(`${BASE_URL}${path}`, { params: httpParams });
  }

  getById(id: string | number): Observable<User> {
    return this.http.get<User>(`${BASE_URL}/users/${id}`);
  }

  /** Posts authored by this user (`/posts/user/{userId}`). */
  postsByUser(userId: string | number): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(`${BASE_URL}/posts/user/${userId}`);
  }

  /** Carts owned by this user (`/users/{userId}/carts`). */
  cartsByUser(userId: string | number): Observable<CartsResponse> {
    return this.http.get<CartsResponse>(`${BASE_URL}/users/${userId}/carts`);
  }
}
