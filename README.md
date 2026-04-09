# Rescale ROI Framework React App

This project turns the ROI workbook into a deployable React frontend.

## Features

- Three live scenarios: conservative, base case, and optimistic
- Editable investment and assumption inputs
- Automatic ROI, payback, benefit, and NPV calculations
- Customer branding controls
- Local save and reload of named views in the browser
- JSON and CSV export
- Print-friendly layout for PDF handoff

## Project structure

- [index.html](/Users/markwhittenburg/Documents/New%20project/index.html): Vite entry HTML
- [package.json](/Users/markwhittenburg/Documents/New%20project/package.json): scripts and dependencies
- [src/App.jsx](/Users/markwhittenburg/Documents/New%20project/src/App.jsx): main UI
- [src/model.js](/Users/markwhittenburg/Documents/New%20project/src/model.js): spreadsheet-derived data and formulas
- [src/styles.css](/Users/markwhittenburg/Documents/New%20project/src/styles.css): app styling and print CSS

## To run locally

1. Install Node.js if it is not already installed.
2. In `/Users/markwhittenburg/Documents/New project`, run `npm install`.
3. Run `npm run dev`.
4. Open the local URL Vite prints in the terminal.

## To build for deployment

1. Run `npm run build`.
2. Deploy the generated `dist` folder to Vercel, Netlify, or any static hosting provider.

## Formula notes

- Engineer Productivity = Engineers x Loaded Cost x Productivity Gain
- Time-to-Market = Toggle x Products x Monthly Revenue x Months x Attribution
- Prototype Reduction = Prototypes Eliminated x Cost per Prototype
- Net Annual Benefit = Total Annual Benefits - Annual Investment
- Year 1 ROI = Net Annual Benefit / Annual Investment
- Payback = Annual Investment / (Total Annual Benefits / 12)
- 3-Year NPV = Discounted net benefits at 10%

## Important assumption note

The original `ROI Model` sheet contained formulas and labels, but many inputs were blank. This app seeds defaults from the populated helper data and pricing/context visible elsewhere in the workbook, so you should treat the values as a strong starting point rather than a final audited model.
