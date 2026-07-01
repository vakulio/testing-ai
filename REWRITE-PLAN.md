# DummyJSON Angular App — Rewrite Plan

> **Status: `PENDING APPROVAL`** — produced by `/oh-my-claudecode:ralplan` (consensus: Planner → Architect → Critic → revise → Critic **APPROVE**). Planning only; no source code has been changed. Approve before execution.
> **Mode:** deliberate (auth/tokens ⇒ pre-mortem + expanded test plan included).
> **Date:** 2026-07-01

---

## 0. Original prompts (verbatim, as provided)

**Prompt 1:**
> Используя DummyJSON документацию которого ты можешь найти на context7 mcp, перепиши приложение и создай в нем, страницу авторизации (DummyJSON это предусматривает), и создай страницы продуктов, карточек, юзеров, постов и комментариев. Свяжи их логично между собой. (это все предусмотрено DummyJSON) /ralplan ultrathink

**Prompt 2:**
> Составь план в отдельный md документ, и укажи в документе сами промпты которые я итебе передал

---

## 1. Current state (verified via codebase exploration)

- **Angular v22**, 100% standalone, signals + native control flow; bootstrapped via `bootstrapApplication`.
- **Zoneless** — no `zone.js` dependency in the repo (only an optional peer in the lockfile). No change-detection provider currently configured.
- **Tailwind CSS v4** (zero-config via PostCSS); global `src/styles.css` = `@import 'tailwindcss';`.
- **Vitest** test runner (`@angular/build:unit-test`), jsdom; Jasmine-style globals.
- `app.routes.ts` is **empty**. `app.config.ts` = only `provideBrowserGlobalErrorListeners()` + `provideRouter(routes)`. **No `provideHttpClient`.**
- No services, models, guards, interceptors, or environments. Blank slate on a clean shell — the only thing to replace is the placeholder `app.html`.
- tsconfig: **not** full `strict:true` (has assorted `noImplicit*` flags); `strictTemplates` not set.
- Scripts: `start`=`ng serve`, `build`=`ng build`, `test`=`ng test`.

## 2. Goal

Build a DummyJSON-backed SPA with a **login page** and pages for **products, carts, users, posts, comments**, logically cross-linked per DummyJSON's real foreign keys.

## 3. Scope decisions & ambiguity flags

- **"карточек" = carts (корзины) — CONFIRMED by user.** Scope locked: build the DummyJSON **carts** resource (list + detail). No open ambiguity remains here.
- Read-only consumption of the public API (DummyJSON fakes writes anyway). Login is real (returns real JWTs).
- Token storage: **localStorage** (demo app; XSS caveat accepted).

## 4. DummyJSON API reference (grounded via context7)

Base URL: `https://dummyjson.com`

| Domain | Endpoints |
|---|---|
| **Auth** | `POST /auth/login {username,password,expiresInMins}` → user + `accessToken` + `refreshToken`; `GET /auth/me` (Bearer); `POST /auth/refresh {refreshToken,expiresInMins}`. Demo creds: `emilys` / `emilyspass`. |
| **Products** | `/products?limit&skip&select&sortBy&order`, `/products/{id}`, `/products/search?q`, `/products/category-list`, `/products/category/{cat}` |
| **Carts** | `/carts`, `/carts/{id}`, `/carts/user/{userId}`, `/users/{id}/carts` |
| **Users** | `/users?limit&skip`, `/users/{id}`, `/users/search?q` |
| **Posts** | `/posts`, `/posts/{id}`, `/posts/search?q`, `/posts/user/{userId}`, `/posts/{id}/comments` |
| **Comments** | `/comments`, `/comments/{id}`, `/comments/post/{postId}` |

List responses wrap `{ <resource>[], total, skip, limit }`.
**Public GET note:** resource GETs (products/users/posts/comments/carts) are public — they do **not** 401 on a stale token. Only protected probes like `/auth/me` (and future writes) 401.

## 5. Architecture (RALPLAN-DR)

### Principles
1. Standalone + signals idiomatic to Angular 22; no NgModules, no external state lib.
2. Feature-first folders; thin components, typed services own HTTP.
3. Cross-link every entity by its real DummyJSON foreign keys (userId, postId, category).
4. Every list view = loading / error / empty / paginated states. No silent failures.
5. Testable seams: functional interceptor + guard + services unit-tested with `HttpTestingController`.

### Decision drivers (top 3)
1. Minimize dependencies; match the existing stack (zoneless, Tailwind v4, Vitest, signals).
2. Auth correctness (token attach, single-flight refresh, guard, session restore) is the risk center.
3. Clear entity linking is the core acceptance requirement — and must avoid N+1 storms against the public sandbox.

### Chosen options (with rejected alternatives)

- **Data access:** HttpClient + typed services returning Observables; components hold signal state via a shared generic **`resourceState<T>()`** helper (loading/error/value/pagination signals written once, not per component). `httpResource()` (Angular v22, developer-preview) is **permitted opt-in for read-only list/detail views**, never for auth. *Rejected:* pure httpResource baseline (preview API risk); NgRx (overkill).
- **Session restore:** fire-and-forget `effect()`/constructor hydration — if a token exists, call `/auth/me` async to populate the `currentUser` signal; the guard depends on **token presence** (sync), not the resolved user. *Rejected:* blocking `provideAppInitializer` (a down/slow public sandbox must not block first paint); route resolver (wrong scope); local JWT decode (fragile).
- **401 handling — single-flight refresh + re-clone retry:** functional interceptor `inject(AuthService)` and delegates; `AuthService` holds one in-flight `refresh$` = **`shareReplay(1)`** (chosen over `BehaviorSubject`; reset after complete) so N concurrent 401s share **one** `/auth/refresh`. On success the interceptor **re-clones the original request with the NEW token** — `next(req.clone({ setHeaders:{ Authorization: 'Bearer ' + newToken }}))` — never resending the stale pre-401 token. **Bounded retry = 1** via a per-request "already retried" marker (a 2nd 401 does not re-trigger refresh). Refresh requests are flagged and never retried. On refresh failure → `AuthService.logout()`. State lives in the **service** (a functional interceptor is stateless per-request). *Rejected:* no-refresh immediate logout (fallback); per-request refresh (thundering herd).

## 5b. Cross-link strategy — prefer embedded data (avoids N+1)

DummyJSON denormalizes many relations into the payload. Use embedded data; fetch-by-FK **only** when the payload gives just an id:

- **Comment** embeds `user:{id,username,fullName}` → render author from payload; link to `/users/:id` with **no** extra fetch.
- **Cart** embeds full `products[]` → render inline; link each to `/products/:id`. Owner is only a `userId` → **one** fetch `/users/:id`.
- **Post** exposes only `userId` (no embedded author) → **one** fetch `/users/:id`.
- **Product** carries a `category` string + embedded `reviews[]` → category chip filters via `/products/category/{cat}`; no per-review fetch.

**Rule:** N+1 request storms against the public sandbox are forbidden — one fetch per FK-only link, none for embedded objects.

### Detail-view route-param reload (reused component instances)

Angular reuses a detail component instance when navigating `/products/1 → /products/2`, so constructor/`effect()` hydration will not re-fire on its own. Chosen mechanism:
- Enable `withComponentInputBinding()` on `provideRouter`; detail components take the route param as an `input()` signal (`id = input.required<string>()`), and a `resourceState`-backed fetch re-runs via an `effect()`/`computed` keyed on `id()`.
- Fallback: subscribe to `ActivatedRoute.paramMap` (or `toSignal(route.paramMap)`) and re-invoke the service on id change.
- `httpResource()` opt-in views get this reactivity natively.

## 6. Proposed structure (new files under `src/app/`)

```
core/
  models/{product,cart,user,post,comment,auth,paginated}.model.ts
  services/{auth,product,cart,user,post,comment}.service.ts
  interceptors/auth.interceptor.ts     (functional; attaches Bearer, single-flight 401→refresh→re-clone)
  guards/auth.guard.ts                 (functional CanActivateFn → UrlTree)
  api.config.ts                        (BASE_URL)
  util/resource-state.ts               (generic signal-state helper)
shared/
  components/{navbar, pagination, search-box, loading-spinner, error-message, empty-state}
features/
  auth/login/
  products/{product-list, product-detail}
  carts/{cart-list, cart-detail}
  users/{user-list, user-detail}
  posts/{post-list, post-detail}
  comments/{comment-list}              (+ comments embedded in post-detail)
app.routes.ts   (lazy loadComponent; authGuard on all except /login)
app.config.ts   (provideZonelessChangeDetection, provideHttpClient(withInterceptors,[withFetch]), provideRouter(routes, withComponentInputBinding))
app.ts / app.html  (app shell: navbar + <router-outlet>)
```

## 7. Routes + relationship map

| Route | Content & links |
|---|---|
| `/login` (public) | login form → on success redirect `returnUrl` or `/products` |
| `/` | redirect → `/products` |
| `/products` | list: search + category filter + pagination → `/products/:id` |
| `/products/:id` | detail: reviews; category chip → `/products?category=` |
| `/carts` | list → `/carts/:id` |
| `/carts/:id` | detail: products (→ `/products/:id`), owner (→ `/users/:id`) |
| `/users` | list: search + pagination → `/users/:id` |
| `/users/:id` | detail: profile + their posts (→ `/posts/:id`) + their carts (→ `/carts/:id`) |
| `/posts` | list: search + pagination → `/posts/:id` |
| `/posts/:id` | detail: body + author (→ `/users/:id`) + comments (each author → `/users/:id`) |
| `/comments` (optional) | global list → post (→ `/posts/:id`) + author |

Navbar: Products · Carts · Users · Posts · (right) current-user avatar from `/auth/me` + Logout.

## 8. Auth flow

1. Login form (reactive forms; demo-creds hint) → `AuthService.login()` → `POST /auth/login`.
2. Store `accessToken` + `refreshToken` (localStorage) + set `currentUser` signal.
3. `authInterceptor` adds `Authorization: Bearer <accessToken>` to DummyJSON requests (URL-scoped; skips `/auth/login` & `/auth/refresh`).
4. `authGuard` blocks protected routes when no token → `UrlTree` redirect `/login?returnUrl=`.
5. App start: if token, fire-and-forget `/auth/me` to rehydrate; on 401 attempt single-flight refresh, else logout.
6. Logout: clear storage + signal → `/login`.

## 9. Deliberate-mode pre-mortem

1. **Token attached to non-DummyJSON/login request → breaks login / leaks token.** → interceptor guards by BASE_URL prefix; skips `/auth/login` & `/auth/refresh`.
2. **Refresh recursion (401 on refresh → refresh again → loop).** → flag refresh requests, never retry a refresh; on failure hard-logout.
3. **Concurrent-401 thundering herd** (scope narrowed: only protected probes like `/auth/me` 401, resource GETs are public). → single-flight shared `refresh$`; N concurrent 401s await one refresh, each retries with the NEW token (re-clone).
4. **Session-restore race** (guard runs before `/auth/me` resolves). → guard checks token **presence** (sync); `/auth/me` hydrates async.
5. **Expired-token restore** (present but expired → `/auth/me` 401 → refresh; if refresh fails, async logout mid-navigation). Accepted: brief protected-shell flash then bounce. `AuthService.logout()` reads current `router.url` as `returnUrl` (async logout is outside the guard).
6. **Zoneless test-timing flakiness** (no zone.js). → `provideZonelessChangeDetection()`; tests flush via `HttpTestingController` then `await fixture.whenStable()`/`detectChanges()`; restore `effect()` runs in an injection context.

## 10. Expanded test plan (Vitest)

- **Unit:** each service (URL/params/response mapping via `provideHttpClientTesting`); `authInterceptor` (adds header, skips login/refresh, 401→refresh path, no double-refresh); `authGuard` (allow with token; redirect to `/login?returnUrl=` returning `UrlTree` without).
- **Auth concurrency:** N parallel 401s ⇒ exactly **one** `/auth/refresh`; retried request carries the **new** token; a re-401 after refresh does **not** re-trigger (bounded=1); expired-token-restore → refresh → `logout()` captures `router.url` as `returnUrl`.
- **Route-param reload:** integration test navigating `/products/1 → /products/2` (reused component) re-fetches and swaps data.
- **Zoneless harness:** tests use `provideZonelessChangeDetection()` in TestBed + `await fixture.whenStable()`/`detectChanges()` after flush. httpResource opt-in views ride HttpClient → intercepted by `provideHttpClientTesting`, tested the same way.
- **Integration:** login flow (form → service → token stored → redirect); post-detail loads post + comments + author link; user-detail loads posts + carts.
- **e2e (light/manual):** `ng build` passes; `ng serve` + login `emilys` → navigate all sections + follow cross-links.
- **Observability:** consistent error-message component; console-free happy path.

## 11. Acceptance criteria

- [ ] `ng build` succeeds (no TS/template errors under `strict` + `strictTemplates`); prod budget respected.
- [ ] `ng test` (Vitest) green; services/guard/interceptor covered incl. single-flight + route-param reload.
- [ ] Login with `emilys`/`emilyspass` authenticates; token attached to subsequent calls; navbar shows user.
- [ ] Unauthenticated access to a protected route redirects to `/login` and returns after login.
- [ ] Each of products/carts/users/posts/comments has a working list (pagination + search where applicable) and detail.
- [ ] All cross-links resolve: product↔category, cart↔products/owner, user↔posts/carts, post↔author/comments, comment↔post/author.
- [ ] Loading/error/empty states visible on every data view.
- [ ] Logout clears session and blocks protected routes.

## 12. Execution phases (for team/ralph handoff)

1. **Foundations:** enable `strict:true` + `strictTemplates:true` **first** (verify generated `app.ts`/`app.spec.ts` still compile; fix if not); `app.config` = `provideZonelessChangeDetection()`, `provideHttpClient(withInterceptors([authInterceptor]), withFetch())`, `provideRouter(routes, withComponentInputBinding())`; api.config (BASE_URL); models; base routes + guard (`UrlTree` redirect); app shell/navbar (navbar handles `/auth/me` failure gracefully — no user chip, not a crash); generic `resourceState<T>()` helper.
2. **Auth:** AuthService (login/logout/refresh single-flight/restore), login page, guard, session restore + tests.
3. **Products:** list (search + category + pagination) + detail + tests.
4. **Users:** list + detail (with posts + carts) + tests.
5. **Posts + Comments:** list + detail + embedded comments + tests.
6. **Carts:** list + detail + tests. *(Scope confirmed: carts = корзины.)*
7. **Polish:** shared UI states, styling pass, full build + test + manual smoke.

## 13. ADR

- **Decision:** Angular 22 **zoneless** standalone + signals; HttpClient + typed services with a shared generic `resourceState<T>()` helper (httpResource opt-in for read-only views); functional interceptor delegating to AuthService for **single-flight refresh with re-clone/new-token retry (bounded=1)**; functional guard returning `UrlTree`; fire-and-forget session restore; route params via `withComponentInputBinding()` so reused detail components re-fetch; Tailwind v4; Vitest; feature-first; localStorage tokens; `strict:true`+`strictTemplates` from Phase 1; cross-links prefer embedded payload data.
- **Drivers:** match stack, minimize deps, auth correctness (risk center), entity linking, no N+1 against the sandbox.
- **Alternatives considered:** pure httpResource baseline (preview risk → demoted to opt-in), NgRx (overkill), JWT local decode (fragile), no-refresh auth (fallback), blocking `provideAppInitializer` restore (rejected — blocks paint), per-request refresh (rejected — thundering herd).
- **Consequences:** one shared helper removes per-component boilerplate; single-flight adds ~20 lines + tests; strict mode adds upfront null-safety cost; localStorage XSS caveat accepted for a demo.
- **Follow-ups:** optional full httpResource migration. *("карточек"=carts confirmed by user — no longer open.)*

## 14. Consensus record

| Pass | Agent | Verdict |
|---|---|---|
| 1 | Planner (Opus) | Draft authored |
| 2 | Architect (Opus) | Sound direction; surfaced: N+1 cross-links, missing single-flight, strict-mode contradiction, restore-timing ambiguity → revised |
| 3 | Critic (Opus) | **ITERATE** — re-clone/bounded retry, zoneless, route-param reload → revised |
| 4 | Critic (Opus, re-verify) | **APPROVE** — all findings resolved, no regressions |

---

### Next step (awaiting your decision)

This plan is **pending approval**. To proceed, reply with one of:
- **"approve — team"** → parallel execution via `/oh-my-claudecode:team`
- **"approve — ralph"** → sequential execution via `/oh-my-claudecode:ralph`
- Or request changes.

*Scope note: "карточек" = carts (корзины) — confirmed by user.*
