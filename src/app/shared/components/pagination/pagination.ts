import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly total = input.required<number>();
  readonly skip = input.required<number>();
  readonly limit = input.required<number>();

  readonly pageChange = output<number>();

  readonly currentPage = computed(() => Math.floor(this.skip() / this.limit()) + 1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit())));
  readonly canPrev = computed(() => this.currentPage() > 1);
  readonly canNext = computed(() => this.currentPage() < this.totalPages());

  prev(): void {
    if (this.canPrev()) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  next(): void {
    if (this.canNext()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}
