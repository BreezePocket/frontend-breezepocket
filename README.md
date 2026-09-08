# frontend-breezepocket

A front-end clone of [vectrfl.com](https://www.vectrfl.com/) (Vectr, an industrial-staffing marketing site) rebuilt from scratch as a static Astro site. It reproduces the layout, motion design, and interactions of the original: the intro loader, the scroll-driven hero with a WebGL fly-over, the four-step "flow", sticky feature reveals, the FAQ, sub-page heroes, sticky card stacks, the mission accordion, the multi-step application modal, the crew-request form, and the legal pages.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Astro 5](https://astro.build) (static output, no client framework) |
| Styling | Plain CSS, ported from the original stylesheet with the original class names |
| Motion | [GSAP](https://gsap.com) + ScrollTrigger, [Lenis](https://lenis.darkroom.engineering) smooth scroll |
| 3D | [Three.js](https://threejs.org) procedural scene (no external models) |
| Language | TypeScript (strict) |

## Scripts

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve dist/
npm run check    # astro check (TypeScript + template diagnostics)
```

## Project structure

```
public/            static assets (icons, images, favicon, manifest, OG image)
src/
  layouts/Base.astro       document shell: head/meta/JSON-LD, header, footer, transition overlay, loader (home)
  components/              Header, Footer, Loader, LoaderLogo, Logo, PillButton, CtaSection, SubHero,
                           SubHeroImage, MissionBridge, LegalLayout
  pages/                   index, industries, our-mission, apply, request-crew, privacy, terms,
                           privacy-request, 404
  data/                    all copy and content, one file per page (+ site.ts for global values)
  styles/
    base.css               reset, design tokens (colours, type scale, spacing), utilities
    components.css         shared component styles (buttons, header, mobile nav, footer, loader, forms…)
    pages/*.css            per-page styles, imported by the page that needs them
  scripts/
    main.ts                boots shared behaviour and lazy-loads the page module (data-page on <body>)
    lenis.ts               smooth scroll + scroll helpers (lockScroll, scrollTo, onScroll)
    header.ts              header reveal + mobile navigation drawer
    transitions.ts         wipe overlay on internal navigation
    footer.ts              footer wordmark reveal
    sticky-stack.ts        sticky card stack (industries, apply)
    sub-hero.ts            sub-page hero fold-away on scroll
    pages/<page>.ts        page modules (home/ and apply/ have sub-modules)
    webgl/                 the hero scene (see below)
```

Each page renders `<Base page="…">`; the `page` key selects both the body's `data-page` attribute and the script module that boots for it.

## How the home page works

1. **Loader.** `pages/home.ts` locks scrolling, boots the WebGL scene, and reveals the page once the scene has rendered its first frames *and* at least 2.1 s have passed (hard fallback at 6 s). The header and hero animate in 700 ms later; scrolling unlocks at 2.2 s.
2. **Hero fold.** The title and subtitle fold away in 3D over the first 40% of the viewport height (`pages/home/hero.ts`).
3. **Flow steps.** The `.flow` section is 456svh tall with a sticky wrapper. `pages/home/flow.ts` maps scroll position to the active step using the original thresholds (`0.191`, `0.697`, `0.876`), fills the track bars, and emits a 0–1 *camera progress* value to the scene. Clicking a step header scrolls to it.
4. **Features.** On desktop the 400vh `.features` section pins its content and reveals the four cards with overlapping windows as you scroll (`pages/home/features.ts`).
5. **FAQ.** Single-open accordion animated with `max-height` (`pages/home/faq.ts`).

## The WebGL scene

`src/scripts/webgl/` builds a low-poly world from primitives: a downtown cluster, a power plant with cooling towers and smoke, a wind farm with spinning turbines, and a data campus, linked by red routes and blue signal lines with travelling pulses. The camera flies over the districts as the home page scrolls.

- **Contract:** `webgl/index.ts` (`createScene(mount)` → `setProgress`, `setSection`, `playEntrance`, `setPaused`, `ready`, `destroy`).
- **Camera:** `webgl/camera.ts` — edit `KEYFRAMES` (`progress`, `target`, `azimuth`, `pitch`, `distance`) to retune the flight; positions are threaded through centripetal Catmull-Rom splines and smoothed with a critically damped spring.
- **World:** `webgl/constants.ts` holds the palette, district centres (`AREAS`), and reveal windows (`TIMING`); each district lives in `webgl/world/*.ts`.
- **Rendering:** transparent canvas over the page colour, fog colour pre-compensated for ACES tone mapping so the horizon dissolves into the page, PCF soft shadows that follow the look-at point, and desktop-only bloom for the pulses (automatically disabled if unsupported).
- In dev builds `window.__heroScene` exposes the handle plus a `step(dt)` method for debugging.

Reduced-motion users get the page without the scene and without smooth scrolling.

## Copy and content

All text lives in `src/data/*.ts`. Headings, labels, and navigation match the original site; paragraph copy (descriptions, FAQ answers, mission/apply text, legal pages, disclaimers) was rewritten in original words. Edit the data files to change content without touching markup.

## Forms

- **Apply modal** (`/apply`) posts `multipart/form-data` to `POST /api/apply`.
- **Request crews** (`/request-crew`) posts JSON to `POST /api/request-crew`.

This static build ships no backend: a `404`/`405` from those endpoints is treated as "not configured" and the success state is still shown (with a console warning). To wire a backend, add a serverless function or an Astro adapter with endpoints at those paths that accept the payloads produced in `src/scripts/pages/apply/modal.ts` and `src/scripts/pages/request-crew.ts`.

Drafts are kept in `sessionStorage` (apply) and `localStorage` (request crews) until submitted.

## Before publishing

- The **name, logo, icons, and photographs** belong to the original site and were used here for fidelity only. Replace them (`public/`, `src/components/Logo.astro`, `src/components/LoaderLogo.astro`, `src/data/site.ts`) before any public use.
- The site URL, organisation details, and JSON-LD in `src/data/site.ts` and `src/layouts/Base.astro` still describe the original company.
- The footer credit link is data-driven (`site.credit`).
- Fonts load from Google Fonts (Roboto). The original references a licensed typeface that is not used here.
