import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePageComponent),
  },
  {
    path: 'tutorials',
    loadComponent: () =>
      import('./pages/tutorials/tutorials').then((m) => m.TutorialsPageComponent),
  },
  {
    path: 'tutorials/:slug',
    loadComponent: () =>
      import('./pages/tutorial-detail/tutorial-detail').then(
        (m) => m.TutorialDetailPageComponent,
      ),
  },
  {
    path: 'recommendations',
    loadComponent: () =>
      import('./pages/recommendations/recommendations').then(
        (m) => m.RecommendationsPageComponent,
      ),
  },
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/courses').then((m) => m.CoursesPageComponent),
  },
  {
    path: 'courses/:slug',
    loadComponent: () =>
      import('./pages/course-detail/course-detail').then((m) => m.CourseDetailPageComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/legal/legal-stub/legal-stub').then((m) => m.LegalStubPageComponent),
    data: { title: 'Terms and Conditions' },
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/legal/legal-stub/legal-stub').then((m) => m.LegalStubPageComponent),
    data: { title: 'Privacy Policy' },
  },
  {
    path: 'imprint',
    loadComponent: () =>
      import('./pages/legal/legal-stub/legal-stub').then((m) => m.LegalStubPageComponent),
    data: { title: 'Imprint' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
