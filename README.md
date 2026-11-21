# Harshil Pujara · Portfolio

Static site, no build step. Vercel serves `index.html` from the repository root.

- `index.html`: the whole page (markup, styles and scripts inline)
- `img/ui/`: the case-study screens, exported at 4x straight from Figma
- `img/rl/`: components cut pixel-exact from those exports, used in the preview showreels
- `favicon.svg`: pixel favicon

Fonts load from Google Fonts (Averia Serif Libre, Geist, Geist Mono) and smooth scrolling from Lenis on jsDelivr.

## Interaction Kit (`/kit`)

Four EasyUI components (Wave Transition, Wallet Balance, Photo Box, Not Found), each full screen for recording. React 19, Tailwind v4 and Framer Motion.

- `interaction-kit/`: the source (Vite). Not deployed.
  - `src/components/ui/`, `src/lib/utils.ts`: the EasyUI components, verbatim from the `Surajmaurya1/easyui` repository.
  - `src/demos/`: one full-screen demo per component.
- `kit/index.html`: the build, one self-contained file, served at `/kit`.

```
cd interaction-kit && npm install
npm run dev        # work on it
npm run typecheck
npm run build      # rewrites ../kit/index.html; commit that file
```

Each demo has its own URL (`/kit/#/wave`, `#/wallet`, `#/photo-box`, `#/not-found`). Keys: arrows switch, R replays, H hides the controls; `?clean` starts with them hidden.

Adding more EasyUI components: `npx shadcn@latest add Surajmaurya1/easyui/<name>` works from `interaction-kit/` (there is a `components.json`), but diff what it writes against the repository source. In November 2026 it collapsed repeated tokens inside strings (`viewBox="0 0 24 24"` became `"0 24"`), so these files were copied from the repository instead.
