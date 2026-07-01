import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Course } from '../../data/courses';
import { StarRatingComponent } from '../star-rating/star-rating';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink, MatCardModule, StarRatingComponent],
  templateUrl: './course-card.html',
})
export class CourseCardComponent {
  course = input.required<Course>();
}
