import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommentsResponse } from '../../../core/models/comment.model';
import { CommentService } from '../../../core/services/comment.service';
import { resourceState } from '../../../core/util/resource-state';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { Pagination } from '../../../shared/components/pagination/pagination';

const DEFAULT_LIMIT = 10;

/**
 * Global, paginated comments list. Each comment renders its embedded
 * `user` (no per-comment `/users/{id}` fetch) and links to its parent post.
 */
@Component({
  selector: 'app-comment-list',
  imports: [RouterLink, Pagination, LoadingSpinner, ErrorMessage, EmptyState],
  templateUrl: './comment-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentList {
  private readonly commentService = inject(CommentService);

  readonly skip = signal(0);
  readonly limit = signal(DEFAULT_LIMIT);

  readonly state = resourceState<CommentsResponse>();

  constructor() {
    effect(() => {
      this.state.run(this.commentService.list({ limit: this.limit(), skip: this.skip() }));
    });
  }

  onPageChange(page: number): void {
    this.skip.set((page - 1) * this.limit());
  }
}
