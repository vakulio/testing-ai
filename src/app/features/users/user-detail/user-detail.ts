import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserService } from '../../../core/services/user.service';
import { CartsResponse } from '../../../core/models/cart.model';
import { PostsResponse } from '../../../core/models/post.model';
import { User } from '../../../core/models/user.model';
import { resourceState } from '../../../core/util/resource-state';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

/**
 * User profile detail: fetches the user plus their posts and carts.
 *
 * `id` is bound from the `:id` route param via `withComponentInputBinding()`.
 * Angular reuses this component instance when navigating between two user
 * ids, so all three fetches are driven from a single `effect()` keyed on
 * `id()` — re-running on every id change rather than only on construction.
 */
@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, LoadingSpinner, ErrorMessage, EmptyState],
  templateUrl: './user-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  private readonly userService = inject(UserService);

  readonly id = input.required<string>();

  readonly userState = resourceState<User>();
  readonly postsState = resourceState<PostsResponse>();
  readonly cartsState = resourceState<CartsResponse>();

  constructor() {
    effect(() => {
      const id = this.id();
      this.userState.run(this.userService.getById(id));
      this.postsState.run(this.userService.postsByUser(id));
      this.cartsState.run(this.userService.cartsByUser(id));
    });
  }
}
