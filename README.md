# Harshil Pujara · Portfolio

Static site, no build step. Vercel serves `index.html` from the repository root.

- `index.html`: the whole page (markup, styles and scripts inline)
- `img/ui/`: the case-study screens, exported at 4x straight from Figma
- `img/rl/`: components cut pixel-exact from those exports, used in the preview showreels
- `favicon.svg`: pixel favicon

Fonts load from Google Fonts (Averia Serif Libre, Geist, Geist Mono) and smooth scrolling from Lenis on jsDelivr.

## Interaction Kit (`/kit`)

Six motion studies (frosted bottom sheet, liquid glass toggle, shared-element morph, drag-to-reorder, staggered skeleton, product customizer), built with React, Tailwind and Framer Motion.

- `interaction-kit/`: the source (Vite). Not deployed.
- `kit/index.html`: the build, one self-contained file, served at `/kit`.

```
cd interaction-kit && npm install
npm run dev     # work on it
npm run build   # rewrites ../kit/index.html; commit that file
```

Each demo has its own URL (`/kit/#/sheet`, `#/toggle`, `#/morph`, `#/reorder`, `#/skeleton`, `#/customizer`). Keys: arrows switch, R replays, H hides the controls for recording; `?clean` starts with them hidden.
