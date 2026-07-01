import { Component, input } from '@angular/core';
import { Testimonial } from '../../data/testimonials';
import { StarRatingComponent } from '../star-rating/star-rating';

@Component({
  selector: 'app-testimonial-card',
  imports: [StarRatingComponent],
  templateUrl: './testimonial-card.html',
})
export class TestimonialCardComponent {
  testimonial = input.required<Testimonial>();
}
