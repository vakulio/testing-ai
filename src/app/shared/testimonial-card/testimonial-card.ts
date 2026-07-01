import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Testimonial } from '../../data/testimonials';

@Component({
  selector: 'app-testimonial-card',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './testimonial-card.html',
})
export class TestimonialCardComponent {
  testimonial = input.required<Testimonial>();

  protected readonly stars = computed(() => {
    const filledCount = Math.round(this.testimonial().rating);
    return Array.from({ length: 5 }, (_, i) => i < filledCount);
  });
}
