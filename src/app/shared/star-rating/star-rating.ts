import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
})
export class StarRatingComponent {
  rating = input<number>(5);

  protected readonly stars = computed(() => {
    const filledCount = Math.round(this.rating());
    return Array.from({ length: 5 }, (_, i) => i < filledCount);
  });
}
