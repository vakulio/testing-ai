import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BASE_URL } from '../api.config';
import { CommentsResponse } from '../models/comment.model';
import { Post, PostsResponse } from '../models/post.model';

export interface PostListParams {
  limit?: number;
  skip?: number;
  /** Free-text query. When present, `/posts/search?q=` is used instead of `/posts`. */
  q?: string;
}

/**
 * Owns HTTP access to the DummyJSON posts resource. `commentsByPost` returns
 * comments with their `user` field already embedded by the API — callers
 * must render that embedded author and must NOT issue a per-comment
 * `/users/{id}` request (see REWRITE-PLAN.md §5b, "N+1 forbidden").
 */
@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);

  list(params: PostListParams = {}): Observable<PostsResponse> {
    const { limit, skip, q } = params;
    let httpParams = new HttpParams();
    if (limit !== undefined) {
      httpParams = httpParams.set('limit', limit);
    }
    if (skip !== undefined) {
      httpParams = httpParams.set('skip', skip);
    }

    if (q) {
      httpParams = httpParams.set('q', q);
      return this.http.get<PostsResponse>(`${BASE_URL}/posts/search`, { params: httpParams });
    }

    return this.http.get<PostsResponse>(`${BASE_URL}/posts`, { params: httpParams });
  }

  getById(id: number | string): Observable<Post> {
    return this.http.get<Post>(`${BASE_URL}/posts/${id}`);
  }

  /** Comments for a post; each already embeds `user:{id,username,fullName}`. */
  commentsByPost(postId: number | string): Observable<CommentsResponse> {
    return this.http.get<CommentsResponse>(`${BASE_URL}/posts/${postId}/comments`);
  }
}
