# ROI Calculator Platform

This project is a small web app platform for industry-specific ROI calculators.

It is designed so we can keep adding calculators over time without one calculator replacing another.

## What the app does

The app is organized in three layers:

1. Home page: shows industry paths
2. Industry page: shows workflow-specific calculators for that industry
3. Calculator page: shows the selected calculator with placeholder sections for:
   - workflow description
   - inputs
   - assumptions
   - outcomes
   - formulas

Each calculator has its own route and its own content file.

## How routing works

The app uses simple hash routes so it works cleanly on static hosting without extra server setup.

Examples:

- `#/`
- `#/industries/pharma-biopharma`
- `#/industries/pharma-biopharma/virtual-screening-docking`

## Where the app is organized

- [src/App.jsx](/Users/markwhittenburg/Documents/New%20project/src/App.jsx): top-level app entry
- [src/router.js](/Users/markwhittenburg/Documents/New%20project/src/router.js): route parsing and navigation helpers
- [src/styles.css](/Users/markwhittenburg/Documents/New%20project/src/styles.css): shared design system and page styling
- [src/components](/Users/markwhittenburg/Documents/New%20project/src/components): shared UI building blocks
- [src/pages](/Users/markwhittenburg/Documents/New%20project/src/pages): route-level page components
- [src/data/platform.js](/Users/markwhittenburg/Documents/New%20project/src/data/platform.js): industry registry and calculator lookup maps
- [src/calculators](/Users/markwhittenburg/Documents/New%20project/src/calculators): calculator content modules grouped by industry

## Where each calculator lives

Each calculator lives in its own file inside `src/calculators/<industry>/`.

Examples:

- [src/calculators/pharma-biopharma/virtual-screening-docking.js](/Users/markwhittenburg/Documents/New%20project/src/calculators/pharma-biopharma/virtual-screening-docking.js)
- [src/calculators/semiconductor/design-verification.js](/Users/markwhittenburg/Documents/New%20project/src/calculators/semiconductor/design-verification.js)
- [src/calculators/automotive-mobility/crash-structural-simulation.js](/Users/markwhittenburg/Documents/New%20project/src/calculators/automotive-mobility/crash-structural-simulation.js)

That means a future formula engine for one calculator can be added in that calculator's file or alongside it without touching the rest of the platform.

## How to add a new industry

1. Create a new folder under `src/calculators/` for the industry.
2. Add one file per calculator in that folder.
3. Add an `index.js` file in that folder that exports an array of that industry's calculators.
4. Register the new industry in [src/data/platform.js](/Users/markwhittenburg/Documents/New%20project/src/data/platform.js).
5. The home page and industry page will render from that shared data automatically.

## How to add a new use case

1. Pick the correct industry folder inside `src/calculators/`.
2. Add a new calculator file with:
   - `id`
   - `name`
   - `teaser`
   - `workflowDescription`
   - `inputs`
   - `assumptions`
   - `outcomes`
   - `formulas`
3. Export it from that industry's `index.js`.
4. The industry page and route lookup will pick it up through [src/data/platform.js](/Users/markwhittenburg/Documents/New%20project/src/data/platform.js).

## How to safely update one calculator without affecting the rest

The safest workflow is:

1. Create a branch for the specific calculator change
2. Edit only that calculator's file and any truly shared UI files you need
3. Run `npm run build`
4. Push the branch and review the Vercel preview link
5. Merge to `main` only after the calculator looks right

This keeps:

- `main` as the stable rep-ready version
- branch previews as the draft or staging workflow
- new calculators additive instead of destructive

## How to run locally

1. In `/Users/markwhittenburg/Documents/New project`, run `npm install`
2. Run `npm run dev`
3. Open the local URL printed by Vite

## How to build

Run:

```bash
npm run build
```

That creates the production bundle in `dist/`.
