import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';

import { Cart } from '../../../core/models/cart.model';
import { User } from '../../../core/models/user.model';
import { CartService } from '../../../core/services/cart.service';
import { UserService } from '../../../core/services/user.service';
import { resourceState } from '../../../core/util/resource-state';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoadingSpinner, ErrorMessage],
})
export class CartDetail {
  private readonly cartService = inject(CartService);
  private readonly userService = inject(UserService);

  readonly id = input.required<string>();

  readonly cartState = resourceState<Cart>();
  readonly ownerState = resourceState<User>();

  constructor() {
    // Re-run in full whenever `id()` changes, including when Angular reuses
    // this component instance for a `/carts/1 -> /carts/2` navigation. The
    // owner fetch is chained via `tap` so exactly ONE `/users/{userId}` call
    // fires, only after the cart itself has resolved.
    effect(() => {
      const cartId = this.id();
      this.ownerState.reset();

      const cart$ = this.cartService.getById(cartId).pipe(
        tap((cart) => {
          this.ownerState.run(this.userService.getById(cart.userId));
        }),
      );

      this.cartState.run(cart$);
    });
  }
}
