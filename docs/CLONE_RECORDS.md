# Decoded Frontend — Angular Clone: Records

## Source → Route → Component mapping
| Source URL | Angular Route | Component(s) |
|---|---|---|
| https://decodedfrontend.io/ | / | `HomePageComponent` |
| https://decodedfrontend.io/tutorials/ | /tutorials | `TutorialsPageComponent` |
| https://decodedfrontend.io/<article-slug>/ | /tutorials/:slug | `TutorialDetailPageComponent` |
| https://decodedfrontend.io/recommendations/ | /recommendations | `RecommendationsPageComponent` |
| https://courses.decodedfrontend.io/ | /courses | `CoursesPageComponent` |
| https://courses.decodedfrontend.io/courses/<slug> | /courses/:slug | `CourseDetailPageComponent` |
| (n/a — new) | /terms, /privacy, /imprint | `LegalStubPageComponent` (single reusable component, `title` route-data input) |
| (n/a — new) | /** (wildcard) | redirects to `/` |

All routes are registered in `src/app/app.routes.ts` and lazy-loaded via standalone `loadComponent`. Route-data → component-input binding is enabled with `withComponentInputBinding()` in `src/app/app.config.ts`, which is how the legal stub page receives its `title`.

## Tech stack
- Angular 22 (standalone components, signal-based inputs)
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Vitest for unit tests (via Angular's `ng test` builder)

## What was faithfully reproduced
- All real tutorial titles/authors/categories/dates/excerpts (10 articles) captured from the live site
- All real course titles, pricing, lesson counts, and ratings (6 courses + bundle) from courses.decodedfrontend.io
- Real testimonials/reviews text and author names
- Real recommendations content (WeAreDevelopers event, external course recommendations, reading recommendations)
- Site navigation structure and page layout/section order

## Intentionally simplified / stubbed (explain why for each)
- Article body content: only short representative bodies were written per article (2-3 paragraphs + one code sample) — full article HTML bodies were not scraped page-by-page from the live site, only the homepage/listing teaser excerpts were captured
- No real authentication, payment, or checkout flow — Purchase/Free Preview/Sign In buttons are non-functional UI stubs
- No real video playback — video thumbnails are static placeholders
- Course detail pricing dropdown is static (single price option), not the real multi-tier pricing logic
- Search box and tag filtering are minimal/best-effort, not a full-text search backend
- /terms, /privacy, /imprint are placeholder stub pages (one shared `LegalStubPageComponent`), not real legal content

## Post-build fix
`src/app/app.html` still contained the default `ng new` scaffold markup (the "Hello, ai" hero + pill links) stacked above `<router-outlet />`, so every route rendered the Angular starter template on top of the actual page. Replaced the file with a single `<router-outlet />` and verified via a live `ng serve` + Playwright pass across `/`, `/courses`, `/courses/angular-interview-hacking`, and `/tutorials/first-look-at-signals-in-angular` that only the intended page content renders.

## How to run
```
npm install
npm start   # ng serve, then open http://localhost:4200
npm run build
npm test
```

## Directory structure added
```
src/app/
  data/          # tutorials.ts, tutorial-content.ts, tags.ts, recommendations.ts, courses.ts, testimonials.ts
  shared/        # header, footer, sidebar, tutorial-card, course-card, testimonial-card, star-rating
  pages/         # home, tutorials, tutorial-detail, recommendations, courses, course-detail, legal/legal-stub
```
