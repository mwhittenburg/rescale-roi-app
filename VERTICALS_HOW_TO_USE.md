# How To Use The Vertical ROI Studio

This is the second app in the project.

It does not replace your original ROI app.

## What it is

This app is for exploring industry-specific ROI stories.

Right now it includes templates for:

- Pharmaceutical
- Automotive
- Aerospace
- Oil & Gas
- Manufacturing

## Where it lives

When running locally:

`http://localhost:5173/verticals.html`

When deployed on Vercel:

`https://your-site-url/verticals.html`

For your current project, once pushed, that should be:

`https://rescale-roi-app.vercel.app/verticals.html`

## What it does

- lets you switch between industries
- changes the KPI language by vertical
- changes the ROI assumptions by vertical
- lets you edit each vertical model
- keeps the original app untouched

## Basic use

1. Open the vertical app
2. Click an industry
3. Click a scenario:
   - Conservative
   - Base Case
   - Optimistic
4. Review the executive readout
5. Open `Edit vertical model` if you want to change assumptions

## Why this matters

This gives you a foundation for building:

- pharma-specific ROI pages
- automotive-specific ROI pages
- aerospace-specific ROI pages
- oil and gas-specific ROI pages
- manufacturing-specific ROI pages

without cloning the original app over and over.

## How to publish it

Run:

```bash
git add .
git commit -m "Add vertical ROI studio"
git push
```

Then wait about 30 to 60 seconds and open:

`https://rescale-roi-app.vercel.app/verticals.html`
