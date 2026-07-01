import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommentsResponse } from '../../../core/models/comment.model';
import { Post } from '../../../core/models/post.model';
import { User } from '../../../core/models/user.model';
import { PostService } from '../../../core/services/post.service';
import { UserService } from '../../../core/services/user.service';
import { resourceState } from '../../../core/util/resource-state';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

/**
 * Post detail view.
 *
 * Cross-link strategy (REWRITE-PLAN.md §5b, "N+1 forbidden"):
 * - The post exposes only `userId` (no embedded author) so exactly ONE
 *   `/users/{userId}` request is made, once the post resolves.
 * - Comments already embed `user:{id,username,fullName}` in their payload,
 *   so the author for each comment is rendered straight from that embedded
 *   field — no per-comment `/users/{id}` request is ever issued.
 *
 * `id` is bound from the route param via `withComponentInputBinding()`. The
 * router reuses this component instance across `/posts/1` -> `/posts/2`
 * navigations, so all three fetches are driven by an `effect()` keyed on
 * `id()` to guarantee a full re-fetch on every id change.
 */
@Component({
  selector: 'app-post-detail',
  imports: [RouterLink, LoadingSpinner, ErrorMessage, EmptyState],
  templateUrl: './post-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetail {
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);

  readonly id = input.required<string>();

  readonly postState = resourceState<Post>();
  readonly authorState = resourceState<User>();
  readonly commentsState = resourceState<CommentsResponse>();

  constructor() {
    // Re-fetch the post and its comments whenever the route id changes.
    effect(() => {
      const postId = this.id();
      this.authorState.reset();
      this.postState.run(this.postService.getById(postId));
      this.commentsState.run(this.postService.commentsByPost(postId));
    });

    // Single author fetch, keyed off the resolved post's userId — Post has
    // no embedded author payload, unlike Comment.
    effect(() => {
      const post = this.postState.value();
      if (post) {
        this.authorState.run(this.userService.getById(post.userId));
      }
    });
  }
}
