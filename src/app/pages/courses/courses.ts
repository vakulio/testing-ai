import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { CourseCardComponent } from '../../shared/course-card/course-card';
import { TestimonialCardComponent } from '../../shared/testimonial-card/testimonial-card';
import { COURSES } from '../../data/courses';
import { TESTIMONIALS } from '../../data/testimonials';

@Component({
  selector: 'app-courses',
  imports: [HeaderComponent, FooterComponent, CourseCardComponent, TestimonialCardComponent, RouterLink],
  templateUrl: './courses.html',
})
export class CoursesPageComponent {
  protected readonly courses = signal(COURSES);
  protected readonly testimonials = signal(TESTIMONIALS);
}
