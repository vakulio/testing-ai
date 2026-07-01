# Decoded Frontend — Design System Spec

Single source of truth for the Angular Material + Tailwind redesign. Every component and
page must follow this. Authoring stack: **Angular 22 (standalone, signals) + Angular Material
22 (M3) + Tailwind CSS 4**.

## Brief

**Subject:** "Decoded Frontend" — an education brand teaching *advanced Angular & GraphQL* to
working developers. **Audience:** professional frontend engineers leveling up. **Job of the
page:** signal depth/authority ("decoded" = making hard things legible) and convert developers
into tutorial readers and course buyers.

Two shells exist and must be preserved: `blog` (home, tutorials) and `courses` (courses,
course-detail). The `HeaderComponent` / `FooterComponent` `variant` input drives which.

## The one rule that matters

We use Material components, but they must read as **Decoded Frontend**, never as stock MD3.
No Roboto, no default purple, no uniform 4px-everything. The brand palette + the type pairing
+ the mono "code" accent are what make it ours. When a Material default fights the brand, override
the token in `src/theme.scss` (already wired) — don't fight it with `!important` in components.

## Color tokens

Brand palette (already in `src/styles.css @theme`, use as Tailwind classes `bg-brand-teal` etc.):

| Token | Hex | Role |
|---|---|---|
| `brand-teal` | `#003b4a` | Primary. Brand surfaces (header/footer/hero), Material `color="primary"` |
| `brand-teal-light` | `#0a4c5c` | Hover/secondary teal surface |
| `brand-coral` | `#ff8888` | Tertiary / primary CTA accent, Material `color="tertiary"` |
| `brand-gold` | `#ffd319` | Premium only (bundle CTA). Use sparingly |
| `brand-mint` | `#e5fd98` | Highlight / guarantee flourishes |
| `brand-ink` | `#0c1721` | Primary text on light |

Material system vars are available from the generated theme (teal-derived primary, coral-derived
tertiary): `var(--mat-sys-primary)`, `--mat-sys-on-primary`, `--mat-sys-surface`,
`--mat-sys-on-surface`, `--mat-sys-tertiary`, `--mat-sys-outline-variant`, etc. Prefer Tailwind
`brand-*` classes for brand surfaces; use `--mat-sys-*` inside Material component overrides.

## Typography

Three roles, loaded in `index.html`:

- **Display — `font-display` (Space Grotesk):** all H1/H2 section headers, card titles, hero.
  Weights 500–700. Tight leading on large sizes.
- **Body — `font-sans` (Inter, default):** paragraphs, descriptions, nav, most UI text.
- **Mono utility — `font-mono` (JetBrains Mono):** eyebrows, dates, tags/chips, metadata,
  prices, counts, "read time". This is the code-world signal — use it for small structural
  labels, NOT for body copy.

Type scale (guidance, use Tailwind sizes): hero H1 `text-5xl`→`text-6xl` display; section H2
`text-3xl`→`text-[35px]` display; card title `text-lg`/`text-xl` display 600; body `text-base`
Inter; eyebrow/label `text-xs` mono uppercase `tracking-widest`.

## Signature — the "syntax-token" accent

The one memorable element. Restrained, tied to the subject:

1. **Mono eyebrows:** section labels render as mono, lowercase, with a leading `//` — e.g.
   `// latest tutorials`, `// what people say`. Color `brand-coral` or muted teal. This reads
   as a code comment and is the recurring signature thread.
2. **Hero tokenized keyword:** in the hero H1 only, one key word gets a mono, tertiary-colored,
   subtly boxed treatment (like a highlighted code token). Example: `Decoded <span class="token">Frontend</span>`
   where `.token` is mono/coral. Bold here, quiet everywhere else.

Do NOT add numbered markers (01/02/03) — the content is not a sequence. Do NOT put mono on
body paragraphs. Spend the boldness in the hero; keep the rest disciplined.

## Material component conventions

Import standalone modules per component (`imports: [MatButtonModule, ...]`). Token shapes are
already overridden in `src/theme.scss` (pill buttons, 16px cards).

- **Buttons:** `matButton="filled"` for primary CTAs (teal), `matButton="tonal"`/`matButton="outlined"`
  for secondary. CTA accent buttons use coral via `color`/class. Use the current Angular Material
  button API (`<button matButton="filled">`), `mat-icon-button` for icon-only. Disabled "Load
  More"/"Sign In" stay disabled but styled.
- **Cards:** `<mat-card appearance="outlined">` or elevated per context for course/tutorial/
  testimonial cards. Keep existing routerLinks and inputs.
- **Toolbar:** header uses `<mat-toolbar>` with brand-teal background (transparent variant keeps
  its transparency). Preserve both `blog` and `courses` variants + mobile menu behavior.
- **Icons:** replace hand-drawn nav/close/arrow SVGs with `<mat-icon>` (Material Icons classic
  font is loaded: `menu`, `close`, `chevron_left`, `chevron_right`, `search`, `bookmark_border`).
  KEEP the brand social SVGs (Twitter/YouTube/Facebook) — those are brand marks, not UI icons.
- **Form field:** sidebar search → `<mat-form-field appearance="outline">` + `matInput` +
  `mat-icon-button` suffix, or a matched Material search. Keep it functional (no backend).
- **Chips:** sidebar tags → `<mat-chip-set>`/`mat-chip` (mono label, already themed), preserving
  the `routerLink`/`queryParams`.
- **Star rating:** keep the component API; may render stars with `<mat-icon>star</mat-icon>` /
  `star_border` in coral, or keep `★` glyphs — either is fine, must stay accessible.

## Quality floor (non-negotiable)

- Responsive to mobile (test 375px + 1280px). Preserve existing responsive breakpoints.
- Visible keyboard focus (theme enables `strong-focus-indicators`).
- Respect `prefers-reduced-motion` for any added transitions.
- Do NOT change component public inputs/outputs/selectors or route paths — pages depend on them.
- Keep all existing content/copy meaning; you may sharpen microcopy per the writing guidance
  (active voice, sentence case, name things by what the user does).

## Files & ownership (assigned per task)

Shared: `src/app/shared/{header,footer,sidebar,course-card,tutorial-card,testimonial-card,star-rating}`.
Pages: `src/app/pages/{home,courses,course-detail,tutorials,tutorial-detail,recommendations,legal}`.
Global: `src/styles.css`, `src/theme.scss` (theme owned by lead — request changes, don't edit
unless your task says so).
