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
Industries and use cases are defined from one central catalog so navigation and routing stay in sync.

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
- [src/data/catalog.js](/Users/markwhittenburg/Documents/New%20project/src/data/catalog.js): central source of truth for industries and use cases
- [src/data/calculatorModules.js](/Users/markwhittenburg/Documents/New%20project/src/data/calculatorModules.js): maps catalog entries to calculator modules
- [src/data/platform.js](/Users/markwhittenburg/Documents/New%20project/src/data/platform.js): builds the resolved platform registry used by routes and navigation
- [src/calculators](/Users/markwhittenburg/Documents/New%20project/src/calculators): calculator content modules grouped by industry
- [docs/safe-publishing-workflow.md](/Users/markwhittenburg/Documents/New%20project/docs/safe-publishing-workflow.md): plain-English guide for low-risk updates and publishing

## Where each calculator lives

Each calculator lives in its own file inside `src/calculators/<industry>/`.
The central catalog decides which industries and use cases appear in navigation.

Examples:

- [src/calculators/pharma-biopharma/virtual-screening-docking.js](/Users/markwhittenburg/Documents/New%20project/src/calculators/pharma-biopharma/virtual-screening-docking.js)
- [src/calculators/semiconductor/design-verification.js](/Users/markwhittenburg/Documents/New%20project/src/calculators/semiconductor/design-verification.js)
- [src/calculators/automotive-mobility/crash-structural-simulation.js](/Users/markwhittenburg/Documents/New%20project/src/calculators/automotive-mobility/crash-structural-simulation.js)

That means a future formula engine for one calculator can be added in that calculator's file or alongside it without touching the rest of the platform.

## How to add a new industry

1. Create a new folder under `src/calculators/` for the industry if needed.
2. Add one file per calculator in that folder.
3. Import the calculator modules in [src/data/calculatorModules.js](/Users/markwhittenburg/Documents/New%20project/src/data/calculatorModules.js).
4. Add the new industry and its use cases in [src/data/catalog.js](/Users/markwhittenburg/Documents/New%20project/src/data/catalog.js).
5. The routes, home page, and industry page will render from that shared catalog automatically.

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
3. Import it into [src/data/calculatorModules.js](/Users/markwhittenburg/Documents/New%20project/src/data/calculatorModules.js).
4. Add it to the correct industry's `useCases` list in [src/data/catalog.js](/Users/markwhittenburg/Documents/New%20project/src/data/catalog.js).
5. The industry page and route lookup will pick it up automatically from the catalog-driven platform data.

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

For the plain-English version, see [docs/safe-publishing-workflow.md](/Users/markwhittenburg/Documents/New%20project/docs/safe-publishing-workflow.md).

## Recommended draft-to-publish workflow for low-risk updates

For non-technical users or low-risk content edits:

1. Request a branch for the change
2. Update the one calculator file that needs copy changes
3. Build and review the Vercel preview
4. Approve the preview
5. Merge to `main`

That keeps production stable while making simple edits easy to review.

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
