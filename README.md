# Next.js Simple Template

A bare, immediately-usable Next.js 16 starter. Atomic design enforced, i18n wired, contact form pre-built — no Tailwind, no bloat.

## Stack

| Layer             | Choice                                         |
| ----------------- | ---------------------------------------------- |
| Framework         | Next.js 16 (App Router)                        |
| Language          | TypeScript 5 strict                            |
| Styling           | SCSS Modules — two-layer design token system   |
| Primitives        | `@base-ui/react` (Button, Checkbox, Select)    |
| i18n              | `next-intl` v4 — EN + IT out of the box        |
| Forms             | `react-hook-form` + `zod` + `@emailjs/browser` |
| Class composition | `classnames`                                   |

## Quick start

```bash
git clone <repo-url> my-app
cd my-app
npm install
cp .env.local.example .env.local   # fill in EmailJS credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in your [EmailJS](https://www.emailjs.com/) credentials:

```
NEXT_PUBLIC_EMAILJS_SERVICE=   # EmailJS service ID
NEXT_PUBLIC_EMAILJS_TEMPLATE=  # EmailJS template ID
NEXT_PUBLIC_EMAILJS_KEY=       # EmailJS public key
```

## Project structure

```
src/
├── app/
│   └── [locale]/          # locale-scoped shell
│       ├── layout.tsx     # html/body + Header/Footer + NextIntlClientProvider
│       ├── page.tsx       # demo/home page
│       ├── not-found.tsx  # 404
│       └── error.tsx      # runtime error boundary
├── common/
│   ├── globalInterfaces.ts        # shared enums + interfaces
│   └── emailTemplates/
│       └── ContactTemplate.tsx    # HTML email rendered server-side
├── components/
│   ├── atoms/             # Button, Alert, Checkbox, Select, Grid, TextField, Background
│   ├── molecules/         # (add yours here)
│   ├── organisms/         # Contact, Header, Footer
│   └── templates/         # (add yours here)
├── designSystem/
│   ├── globals.scss       # two-layer CSS tokens + reset
│   ├── variables.scss     # font scales, breakpoints, spacing maps
│   ├── mediaQueries.scss  # media() mixin
│   ├── text.scss          # h1-h4 + text utility classes
│   └── utils.scss         # toRem(), .onlyMobile, .onlyDesktop
├── hooks/
│   └── useScroll.ts       # { scrollY, scrollX, direction }
├── i18n/
│   ├── routing.ts         # locales, routing, Link, redirect, …
│   └── request.ts         # getRequestConfig — loads public/messages/*.json
└── proxy.ts               # next-intl createMiddleware (named proxy, not middleware)

public/
└── messages/
    ├── en.json
    └── it.json
```

## Adding a page

1. Create `src/app/[locale]/your-page/page.tsx`
2. Add an i18n key block to both `public/messages/en.json` and `public/messages/it.json`
3. Link to `/your-page` using `Link` from `@/i18n/routing` for locale-aware navigation

## Adding translations

All translation files live in `public/messages/`. Add the same key to every locale file:

```json
// en.json
{ "myPage": { "title": "Hello" } }

// it.json
{ "myPage": { "title": "Ciao" } }
```

Use in server components:

```ts
const t = await getTranslations("myPage");
t("title"); // "Hello"
```

Use in client components:

```ts
const t = useTranslations("myPage");
t("title"); // "Hello"
```

## Design tokens

Components reference semantic CSS variables only — never palette primitives directly:

```scss
// correct
color: var(--color-text);
background: var(--color-primary);

// wrong
color: var(--palette-neutral-900);
```

Toggle dark mode by setting `data-theme="dark"` on `<html>`.

## Grid

```tsx
import { Container, Row, Col } from "@/components/atoms/Grid";

<Container>
	<Row>
		<Col xs={12} md={6} lg={4}>
			…
		</Col>
	</Row>
</Container>;
```

Responsive col/offset/order/alignSelf classes generated for every breakpoint: `xs sm md lg xl xxl`.

## Scripts

| Command         | Description             |
| --------------- | ----------------------- |
| `npm run dev`   | Dev server              |
| `npm run build` | Production build        |
| `npm run start` | Start production server |
| `npm run lint`  | ESLint                  |
