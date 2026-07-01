import { Component, computed, input } from '@angular/core';
import { Testimonial } from '../../data/testimonials';

@Component({
  selector: 'app-testimonial-card',
  imports: [],
  templateUrl: './testimonial-card.html',
})
export class TestimonialCardComponent {
  testimonial = input.required<Testimonial>();

  protected readonly stars = computed(() => {
    const filledCount = Math.round(this.testimonial().rating);
    return Array.from({ length: 5 }, (_, i) => i < filledCount);
  });
}
