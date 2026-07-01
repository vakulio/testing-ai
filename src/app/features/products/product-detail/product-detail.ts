import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { resourceState } from '../../../core/util/resource-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';

/**
 * `/products/:id` detail page.
 *
 * `id` is bound from the route param via `withComponentInputBinding()`.
 * Angular reuses this component instance when navigating between two detail
 * routes (e.g. `/products/1` -> `/products/2`), so the fetch is driven by an
 * `effect()` keyed on `id()` rather than one-shot constructor/`ngOnInit`
 * logic — that effect re-runs whenever the bound input changes, guaranteeing
 * a fresh fetch (and non-stale rendered data) on every id change.
 */
@Component({
  selector: 'app-product-detail',
  imports: [LoadingSpinner, ErrorMessage],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  readonly product = resourceState<Product>();

  constructor() {
    effect(() => {
      const id = this.id();
      this.product.run(this.productService.getById(id));
    });
  }

  filterByCategory(category: string): void {
    this.router.navigate(['/products'], { queryParams: { category } });
  }
}
