import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  imports: [MatIconModule],
  templateUrl: './star-rating.html',
})
export class StarRatingComponent {
  rating = input<number>(5);
  color = input<'gold' | 'coral' | 'black'>('gold');

  protected readonly stars = computed(() => {
    const filledCount = Math.round(this.rating());
    return Array.from({ length: 5 }, (_, i) => i < filledCount);
  });

  protected readonly filledClass = computed(() => {
    switch (this.color()) {
      case 'coral':
        return '!text-brand-coral';
      case 'black':
        return '!text-[#0C1721]';
      default:
        return '!text-yellow-400';
    }
  });
}
