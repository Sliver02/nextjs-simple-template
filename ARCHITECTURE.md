# Architecture

## Design system — two-layer tokens

Tokens live in `src/designSystem/globals.scss` and follow a strict two-layer rule:

**Layer 1 — palette primitives** (raw values, never used in components directly):

```css
--palette-neutral-0: #ffffff;
--palette-primary-500: #0070f3;
```

**Layer 2 — semantic tokens** (the only layer components touch):

```css
--color-text: var(--palette-neutral-900);
--color-primary: var(--palette-primary-500);
--color-bg: var(--palette-neutral-0);
```

Dark mode remaps Layer 2 via `[data-theme="dark"]` on `<html>` — Layer 1 never changes. No `prefers-color-scheme` media query; the theme attribute is set explicitly.

Typography tokens (`--font-body`, `--font-heading`) default to `system-ui`. Override them in `globals.scss` to wire in custom fonts.

## SCSS modules

Every component owns `ComponentName.tsx` + `ComponentName.module.scss`. Global design system files are imported via relative paths — `sassOptions.includePaths` is a [known unresolved bug](https://github.com/vercel/next.js/issues/60088) in Turbopack (Next.js 16's default bundler):

```scss
// atoms/Grid/Col/Col.module.scss — 4 levels from src/
@use "../../../../designSystem/variables";
@use "../../../../designSystem/mediaQueries" as mq;

// organisms/Header/Header.module.scss — 3 levels from src/
@use "../../../designSystem/mediaQueries" as mq;
```

Files within `src/designSystem/` import each other by bare name (Sass resolves them relative to the file's own directory):

```scss
// designSystem/globals.scss
@use "variables";
@use "mediaQueries";
```

Utility mixins:

- `@include mq.media("md")` — `min-width` breakpoint guard (`xs sm md lg xl xxl`)
- `@include utils.toRem(font-size, variables.$font-lg)` — px → rem conversion

Global text utility classes (applied as plain class strings, not module refs):

- `.text--h-xl`, `.text--p-lg`, `.text--align-center`, `.text--strong`, etc.
- `.onlyMobile` / `.onlyDesktop` — responsive show/hide at `md` breakpoint

### Conventions

**No bare tag selectors in `*.module.scss`.** Global tag defaults (`h1–h4`, `p`, `a`) are set once in `globals.scss` / `text.scss`. Component stylesheets must never override them via tag selectors — add an explicit class to the element instead:

```scss
// wrong
.card a {
	color: red;
}

// correct
.link {
	color: red;
}
```

**Consume design system values via `@use`, not inline literals.** Before writing a custom `font-size`, `color`, or breakpoint, check whether a DS variable, mixin, or utility class already covers it:

```scss
@use "../../../designSystem/utils";
@use "../../../designSystem/variables";

.title {
	@include utils.toRem(font-size, variables.$font-h-sm); // not font-size: 2rem
}
```

For colors, always reference semantic tokens (`var(--color-text)`, `var(--color-primary)`) — never palette primitives (`var(--palette-neutral-900)`) or raw hex values.

## Atomic design

```
atoms/       — no dependencies on other components
molecules/   — composed of atoms only
organisms/   — composed of atoms + molecules
templates/   — page-level layout shells (no data)
app/[locale] — data-fetching pages assembled from templates/organisms
```

Barrel re-exports enforce import hygiene:

```ts
// correct
import { Button } from "@/components/atoms/Button";

// wrong — import from the module file directly
import Button from "@/components/atoms/Button/Button";
```

## Base-UI primitives

Accessible headless primitives from `@base-ui/react` are wrapped in thin adapter components. State is styled exclusively via `data-[state]` attributes in SCSS — no JS class toggling:

```scss
// Button
&[data-disabled] {
	opacity: 0.4;
}

// Checkbox
&[data-checked] .indicator {
	opacity: 1;
}

// Select
&[data-popup-open] .arrow {
	transform: rotate(180deg);
}
```

## i18n routing

`next-intl` v4 is wired via `src/proxy.ts` (not `middleware.ts` — Next.js 16 reserves that name). The proxy skips static assets, API routes, and files with extensions.

Route structure: `app/[locale]/…` with `generateStaticParams` emitting one entry per locale.

Navigation helpers from `@/i18n/routing` are locale-aware wrappers around Next.js primitives:

- `Link` — locale-prefixed `<a>`
- `usePathname` — path without locale prefix
- `redirect`, `useRouter`, `getPathname`

Switching locale:

```tsx
<Link href={pathname} locale="it">
	IT
</Link>
```

Messages load from `public/messages/{locale}.json` at request time via `src/i18n/request.ts`.

## Grid system

12-column fluid grid with a `--max-width: 1440px` container cap.

Classes generated at build time for each breakpoint × each prop:

- `.md-6` → `grid-column: span 6` at `md+`
- `.mdOffset-2` → `grid-column-start: 3` at `md+`
- `.mdOrder-1` → `order: 1` at `md+`
- `.mdAlignSelf-flex-start` → `align-self: flex-start` at `md+`

`Row` passes `gap` as an inline CSS variable; `Col` reads it. This keeps gap values dynamic without generating a combinatorial class matrix.

## Contact form flow

```
useForm (react-hook-form + zod)
  → onSubmit
  → renderToStaticMarkup(<ContactTemplate />) — builds HTML email body server-side
  → emailjs.send(serviceId, templateId, { message_html, name, email }, publicKey)
  → setAlert({ severity: "success" | "error", text })
  → reset() on success
```

EmailJS credentials come from `NEXT_PUBLIC_EMAILJS_*` env vars. The template on the EmailJS dashboard receives `message_html` as the email body — configure it there, not in code.

## Header scroll behaviour

`useScroll` (passive event listener) returns `{ scrollY, direction: "up"|"down"|null }`.

The Header applies `.hidden` (CSS `transform: translateY(-100%)`) when `direction === "down" && scrollY > 80`. Re-appearing on scroll up is automatic since the class is removed. The transition is CSS-only — no JS animation.

## File naming convention

| File                        | Purpose                  |
| --------------------------- | ------------------------ |
| `ComponentName.tsx`         | Component implementation |
| `ComponentName.module.scss` | Scoped styles            |
| `index.ts`                  | Named barrel export      |

Never use default exports from barrel files. Always use named exports:

```ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```
