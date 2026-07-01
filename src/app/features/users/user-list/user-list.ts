import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserService } from '../../../core/services/user.service';
import { UsersResponse } from '../../../core/models/user.model';
import { resourceState } from '../../../core/util/resource-state';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { SearchBox } from '../../../shared/components/search-box/search-box';

const PAGE_SIZE = 12;

/**
 * Paginated, searchable user list. Re-fetches whenever the search query or
 * page (skip) changes via an `effect()` keyed on those signals.
 */
@Component({
  selector: 'app-user-list',
  imports: [RouterLink, SearchBox, Pagination, LoadingSpinner, ErrorMessage, EmptyState],
  templateUrl: './user-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  private readonly userService = inject(UserService);

  readonly query = signal('');
  readonly skip = signal(0);
  readonly limit = signal(PAGE_SIZE);

  readonly state = resourceState<UsersResponse>();

  constructor() {
    effect(() => {
      const query = this.query();
      const skip = this.skip();
      const limit = this.limit();
      this.state.run(this.userService.list({ limit, skip, q: query || undefined }));
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
