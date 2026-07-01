import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { TestimonialCardComponent } from '../../shared/testimonial-card/testimonial-card';
import { COURSES, COURSE_DETAIL, INSTRUCTOR } from '../../data/courses';
import { TESTIMONIALS } from '../../data/testimonials';

@Component({
  selector: 'app-course-detail',
  imports: [HeaderComponent, FooterComponent, TestimonialCardComponent, MatButtonModule, MatCardModule],
  templateUrl: './course-detail.html',
})
export class CourseDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly instructor = INSTRUCTOR;

  private readonly slug = computed(() => this.route.snapshot.paramMap.get('slug') ?? '');

  protected readonly course = computed(() => COURSES.find((c) => c.slug === this.slug()));

  protected readonly detail = computed(() => COURSE_DETAIL[this.slug()]);

  protected readonly reviews = computed(() =>
    TESTIMONIALS.filter((t) => t.courseSlug === this.slug()),
  );
}
