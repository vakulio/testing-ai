import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../data/courses';
import { StarRatingComponent } from '../star-rating/star-rating';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink, StarRatingComponent],
  templateUrl: './course-card.html',
})
export class CourseCardComponent {
  course = input.required<Course>();

  protected readonly initial = computed(() => {
    const title = this.course().isBundle ? 'All-in-One Bundle' : this.course().title;
    return title.charAt(0);
  });
}
