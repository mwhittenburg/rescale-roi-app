# Safe Publishing Workflow

This document explains the safest way to update the ROI Calculator Platform without accidentally breaking other calculators.

## Best rule

If you only need to change one calculator, only edit that calculator's file and the central catalog if needed.

Avoid editing shared files unless the change truly belongs everywhere.

## Lowest-risk change type

The safest updates are content-only changes inside one calculator file.

Examples:

- changing the teaser text
- changing workflow description wording
- updating placeholder inputs
- revising assumptions copy
- revising outcomes copy
- adding formula placeholder notes

These updates are usually limited to one file inside `src/calculators/<industry>/`.

## Draft-to-publish flow for non-technical or low-risk updates

1. Ask for a branch or draft copy of the work
2. Make the small content change in one calculator file
3. Run `npm run build`
4. Push the branch
5. Open the Vercel preview link and review only the affected calculator
6. Merge to `main` only after the preview looks correct

This gives you:

- a stable production version on `main`
- a draft preview for review
- a clean path to publish once approved

## When to edit the central catalog

Edit [src/data/catalog.js](/Users/markwhittenburg/Documents/New%20project/src/data/catalog.js) only when you need to:

- add a new industry
- add a new use case
- change industry display names
- change which calculators belong to an industry

If you are only updating text inside one existing calculator, you usually do not need to touch the catalog.

## When to avoid shared files

Be careful with:

- [src/styles.css](/Users/markwhittenburg/Documents/New%20project/src/styles.css)
- [src/components](/Users/markwhittenburg/Documents/New%20project/src/components)
- [src/pages](/Users/markwhittenburg/Documents/New%20project/src/pages)
- [src/router.js](/Users/markwhittenburg/Documents/New%20project/src/router.js)

Changes there can affect many calculators at once.

## Safe checklist before publishing

1. Confirm the change is limited to the intended calculator
2. Run `npm run build`
3. Review the Vercel preview link
4. Check the home page still loads
5. Check the industry page still loads
6. Check the edited calculator page still loads
7. Merge to `main`

## Easy rule of thumb

- Calculator copy change: edit one calculator file
- Add new calculator: add one calculator file and one catalog entry
- Change platform behavior: use a branch and preview very carefully
