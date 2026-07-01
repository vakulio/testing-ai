import { Component, input } from '@angular/core';
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
}
