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

## Style-parity pass
An initial build used generic Tailwind defaults (orange accent, card-grid tutorial list) that didn't match the real site. Re-verified against live Playwright screenshots and `getComputedStyle()` sampling of decodedfrontend.io / courses.decodedfrontend.io, then restyled to match:
- **Brand tokens** added in `src/styles.css` `@theme`: `--color-brand-teal` (#003b4a), `--color-brand-teal-light` (#0a4c5c), `--color-brand-coral` (#ff8888), `--color-brand-gold` (#ffd319), `--color-brand-mint` (#e5fd98). Poppins loaded via Google Fonts in `src/index.html` and set as the body font.
- **Blog side**: header/hero/footer now solid `bg-brand-teal` (matches the real site's always-on dark teal bar, not the generic Tailwind default). Tutorial list rebuilt from a card grid into the real site's timeline layout (large coral day/month numbers + connecting line, sharp-cornered coral "Read On"/"Read Later" buttons). The real site has no persistent sidebar — search/tags now live in an off-canvas panel (`src/app/shared/ui-state.service.ts`, a signal-based toggle) triggered by the header hamburger, matching the source instead of a permanent two-column layout.
- **Courses side**: hero/footer/bundle-CTA banner recolored to `bg-brand-teal`, CTA button to `bg-brand-gold`, guarantee heading to `text-brand-mint`, testimonial accents to `text-brand-coral`. Course cards use a brand-teal→brand-coral gradient block with the course initial in place of the real site's per-course illustration artwork (no illustration assets available).
- **Known remaining gap**: individual real course detail pages (e.g. Angular Interview Hacking) use bespoke per-course colors and extra sections (pricing tiers, FAQ, topic accordion) from the course platform's page builder — those are one-off content, not the shared template, and were intentionally not replicated. Our course detail page uses the consistent site-wide brand palette instead.

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
