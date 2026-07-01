import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PostsResponse } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';
import { resourceState } from '../../../core/util/resource-state';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { SearchBox } from '../../../shared/components/search-box/search-box';

const DEFAULT_LIMIT = 10;

/** Paginated, searchable posts list. Each post links to its detail view. */
@Component({
  selector: 'app-post-list',
  imports: [RouterLink, SearchBox, Pagination, LoadingSpinner, ErrorMessage, EmptyState],
  templateUrl: './post-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostList {
  private readonly postService = inject(PostService);

  readonly query = signal('');
  readonly skip = signal(0);
  readonly limit = signal(DEFAULT_LIMIT);

  readonly state = resourceState<PostsResponse>();

  constructor() {
    effect(() => {
      this.state.run(
        this.postService.list({
          limit: this.limit(),
          skip: this.skip(),
          q: this.query() || undefined,
        }),
      );
    });
  }

  onQueryChange(query: string): void {
    this.query.set(query);
    this.skip.set(0);
  }

  onPageChange(page: number): void {
    this.skip.set((page - 1) * this.limit());
  }
}
