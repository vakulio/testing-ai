import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { ProductsResponse } from '../../../core/models/product.model';
import { resourceState } from '../../../core/util/resource-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { SearchBox } from '../../../shared/components/search-box/search-box';

/**
 * `/products` list: search box, category filter, paginated grid.
 *
 * `category` is bound from the `?category=` query param via
 * `withComponentInputBinding()`, so picking a category (or arriving via a
 * detail-page category chip link) both flow through the same URL state.
 */
@Component({
  selector: 'app-product-list',
  imports: [RouterLink, LoadingSpinner, ErrorMessage, EmptyState, Pagination, SearchBox],
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  /** Bound from the `?category=` query param. */
  readonly category = input<string | null>(null);

  readonly query = signal('');
  readonly skip = signal(0);
  readonly limit = signal(12);

  readonly categories = resourceState<string[]>();
  readonly products = resourceState<ProductsResponse>();

  constructor() {
    this.categories.run(this.productService.categories());

    // Re-fetch whenever the search query, pagination window, or category
    // filter changes. Signal writes inside handlers below are batched, so
    // this fires once per user action.
    effect(() => {
      const q = this.query();
      const skip = this.skip();
      const limit = this.limit();
      const category = this.category();

      this.products.run(this.productService.list({ q, skip, limit, category }));
    });
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.skip.set(0);
  }

  onPageChange(page: number): void {
    this.skip.set((page - 1) * this.limit());
  }

  onCategoryChange(category: string): void {
    this.skip.set(0);
    this.router.navigate([], {
      queryParams: { category: category || null },
      queryParamsHandling: 'merge',
    });
  }
}
