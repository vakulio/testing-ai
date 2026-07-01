import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BASE_URL } from '../api.config';
import { CommentsResponse } from '../models/comment.model';

export interface CommentListParams {
  limit?: number;
  skip?: number;
}

/** Owns HTTP access to the DummyJSON global comments resource. */
@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly http = inject(HttpClient);

  list(params: CommentListParams = {}): Observable<CommentsResponse> {
    const { limit, skip } = params;
    let httpParams = new HttpParams();
    if (limit !== undefined) {
      httpParams = httpParams.set('limit', limit);
    }
    if (skip !== undefined) {
      httpParams = httpParams.set('skip', skip);
    }

    return this.http.get<CommentsResponse>(`${BASE_URL}/comments`, { params: httpParams });
  }
}
