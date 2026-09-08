# BreezePocket — landing site

**Get paid while waiting for the crypto price you want.**

BreezePocket is a Solana app for people who hold crypto and are happy to wait. Deposit SOL, BTC, ETH or USDC, name the price you would gladly sell (or buy) at, and earn income while the market gets there. If your price is reached, the trade fills at that price and you keep the income; if not, you keep your coins plus the income and can set a new target. Built on Solana, coming to the Seeker phone. This repository is the marketing site: a static Astro build with a scroll-driven WebGL hero, strategy pages, a waitlist flow, an early-access form and legal pages.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Astro 5](https://astro.build) (static output, no client framework) |
| Styling | Plain CSS with design tokens in `src/styles/base.css` |
| Motion | [GSAP](https://gsap.com) + ScrollTrigger, [Lenis](https://lenis.darkroom.engineering) smooth scroll |
| 3D | [Three.js](https://threejs.org) procedural hero scene (no external models) |
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
public/
  brand/                   logo bitmaps (full lock-up, wordmark, mark; white variants)
  icons/                   favicons, manifest icons, feature icons, UI glyphs
  img/                     SVG illustrations used by the pages
  share/ogp.png            Open Graph image
src/
  layouts/Base.astro       document shell: meta/JSON-LD, header, footer, transition overlay, loader (home)
  components/              Header, Footer, Loader, LoaderLogo, Logo, PillButton, CtaSection, SubHero,
                           SubHeroImage, MissionBridge, LegalLayout, SeekerMockup
  pages/                   index, strategies, our-mission, waitlist, early-access, privacy, terms,
                           privacy-request, 404
  data/                    all copy and content, one file per page (+ site.ts for global values)
  styles/                  base.css (tokens/reset), components.css, pages/*.css
  scripts/
    main.ts                boots shared behaviour and lazy-loads the page module (data-page on <body>)
    lenis.ts, header.ts, transitions.ts, footer.ts, sticky-stack.ts, sub-hero.ts
    pages/<page>.ts        page modules (home/ and waitlist/ have sub-modules)
    webgl/                 the hero scene (see below)
```

Each page renders `<Base page="…">`; the `page` key sets `data-page` on the body and selects the script module that boots for it.

## Editing content and brand

- **Copy** lives in `src/data/*.ts`. Change text there rather than in the markup.
- **Global values** (name, URL, emails, nav labels, CTA labels, footer links, logo paths) are in `src/data/site.ts`. The site URL is a placeholder until the domain is final.
- **Logo**: master file exported to `public/brand/*.png`; regenerate the favicons and the OG image if the logo changes (they are derived from the mark and the full lock-up).
- **Colours**: brand tokens are in `src/styles/base.css` (`--color-highlight` blue, `--color-dark` navy, `--color-text`). The WebGL palette is in `src/scripts/webgl/constants.ts`.

## How the home page works

1. **Loader** — `pages/home.ts` locks scrolling, boots the WebGL scene and reveals the page once the scene has rendered its first frames and at least 2.1 s have passed (hard fallback at 6 s).
2. **Hero fold** — the title and subtitle fold away in 3D over the first 40% of the viewport height.
3. **Flow steps** — the `.flow` section maps scroll position to the four steps (pick your asset, name your price, get paid while you wait, filled or free to go again) and feeds a 0–1 progress value to the scene camera.
4. **Features** — the pinned `.features` section reveals the four strategies as you scroll.
5. **Solana / Seeker** — `SeekerMockup.astro` renders a CSS-only phone with the app screen.
6. **FAQ** — single-open accordion.

## The WebGL scene

`src/scripts/webgl/` builds a low-poly world from primitives: a plaza of token stacks (holdings), a rising price chart with a glowing sell target, a dipping chart with a buy target beside a price grid, and rows of growing coin stacks with the wave emblem (accumulation), linked by route lines with travelling pulses. The camera flies from a wide hero view into each district as the page scrolls.

- **Contract**: `webgl/index.ts` (`createScene(mount)` → `setProgress`, `setSection`, `playEntrance`, `setPaused`, `ready`, `destroy`).
- **Camera**: `webgl/camera.ts` — edit `KEYFRAMES` (`progress`, `target`, `azimuth`, `pitch`, `distance`).
- **World**: `webgl/constants.ts` holds the palette, district centres (`AREAS`) and reveal windows (`TIMING`); districts live in `webgl/world/{holdings,targets,accumulate}.ts`.
- In dev builds `window.__heroScene` exposes the handle plus `step(dt)` for debugging.

Reduced-motion users get the page without the scene and without smooth scrolling.

## Forms

- **Waitlist modal** (`/waitlist`) posts `multipart/form-data` to `POST /api/waitlist`.
- **Early access** (`/early-access`) posts JSON to `POST /api/early-access`.

No backend ships with this static build: a `404`/`405` from those endpoints is treated as "not configured" and the success state is still shown (with a console warning). Wire a serverless function or an Astro adapter at those paths to receive the payloads. Drafts are kept in `sessionStorage` (waitlist) and `localStorage` (early access) until submitted.

## Notes

- Yield figures shown in the app mockup are illustrative placeholders, not live data.
- The legal pages are generic templates and need review by counsel before launch.
