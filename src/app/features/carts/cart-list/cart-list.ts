import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { CartsResponse } from '../../../core/models/cart.model';
import { resourceState } from '../../../core/util/resource-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Pagination } from '../../../shared/components/pagination/pagination';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoadingSpinner, ErrorMessage, EmptyState, Pagination],
})
export class CartList {
  private readonly cartService = inject(CartService);

  readonly limit = signal(PAGE_SIZE);
  readonly skip = signal(0);

  readonly state = resourceState<CartsResponse>();

  constructor() {
    effect(() => {
      this.state.run(this.cartService.list({ limit: this.limit(), skip: this.skip() }));
    });
  }

  onPageChange(page: number): void {
    this.skip.set((page - 1) * this.limit());
  }
}
