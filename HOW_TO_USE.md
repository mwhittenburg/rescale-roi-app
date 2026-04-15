# How To Use The Rescale ROI App

This guide is written for someone who does not code.

## What this app is

This is a web app version of your ROI spreadsheet.

It lets you:

- view ROI scenarios
- edit assumptions
- save versions in your browser
- export data
- print or save as PDF
- publish updates to your live Vercel site

Live site:

[https://rescale-roi-app.vercel.app/](https://rescale-roi-app.vercel.app/)

## The two ways to use it

### 1. Presentation mode

Use this when you want to show the business case to someone.

This is the cleaner, more polished top part of the page.

### 2. Editor mode

Use this when you want to change assumptions, branding, or scenario inputs.

Click:

`Edit assumptions`

to open the editing section.

## What the main buttons do

### `Edit assumptions`

Opens the editable inputs and branding controls.

### `Save scenario`

Saves the current version in your browser on that computer.

Good for:

- trying different customer versions
- saving a few drafts
- comparing different assumptions

### `Export inputs`

Downloads the current inputs as a CSV file.

CSV files can be opened in Excel or Google Sheets.

### `Export JSON`

Downloads the full model data in a technical format.

You probably will not use this often unless someone wants the raw data.

### `Print / PDF`

Opens the browser print dialog so you can:

- print the page
- save the page as a PDF

## How to update the customer info

1. Open the site
2. Click `Edit assumptions`
3. Find the `Branding` section
4. Change:
   - Customer
   - Prepared date
   - Prepared by
   - Logo text
   - Accent color

These changes update the presentation view.

## How to change the ROI numbers

1. Click `Edit assumptions`
2. Scroll to the `Investment` or `Assumptions` sections
3. Change the numbers in:
   - Conservative
   - Base Case
   - Optimistic

The app recalculates automatically.

You do not need to press a save button for the math to update.

## How to switch scenarios

At the top summary area, click:

- `Conservative`
- `Base Case`
- `Optimistic`

This changes which scenario you are looking at.

## How to save a version for later

1. Make your changes
2. Click `Save scenario`
3. Look in the `Saved views` area
4. Use:
   - `Load` to reopen a saved version
   - `Delete` to remove one

Important:

Saved views are stored in your browser on your computer.
They are not shared automatically with other people.

## How to make a PDF

1. Open the live site
2. Click `Print / PDF`
3. In the print window, choose `Save as PDF`
4. Save the file

This is useful for sending a static version to someone.

## How to run the app on your computer

Use this if you want to edit or test the app locally.

### Start the local app

Open Terminal and run:

```bash
cd "/Users/markwhittenburg/Documents/New project"
npm run dev
```

Then open the local link shown in Terminal.

It will usually be:

```bash
http://localhost:5173/
```

### Stop the local app

In Terminal, press:

```bash
Control + C
```

## How to publish new changes to the live website

Whenever changes are made on your computer, they are not live until you push them to GitHub.

Then Vercel automatically updates the site.

### Publish changes

Open Terminal and run these one at a time:

```bash
cd "/Users/markwhittenburg/Documents/New project"
git add .
git commit -m "Describe what changed"
git push
```

Examples:

```bash
git commit -m "Update ROI assumptions"
```

```bash
git commit -m "Restyle homepage"
```

After that:

1. wait about 30 to 60 seconds
2. refresh the live site

## If something looks wrong

### The site did not update

Try:

1. wait 30 to 60 seconds
2. refresh the page
3. use a hard refresh with:

`Command + Shift + R`

### The local app will not start

Make sure you are in the correct folder:

```bash
cd "/Users/markwhittenburg/Documents/New project"
```

Then try:

```bash
npm run dev
```

### Git says there is nothing to commit

That means no new files have changed since the last push.

### The live site still looks old

Usually this means:

- the changes were not pushed yet
- Vercel is still building
- your browser is caching the old version

## Best simple workflow

If you want the easiest process, do this:

1. Open the live site
2. Decide what you want to change
3. Make the changes locally
4. Test locally
5. Push with:
   - `git add .`
   - `git commit -m "your message"`
   - `git push`
6. Refresh the live site

## Good future improvements

You may want to add later:

- real logo upload
- stronger PDF layout
- locked or client-safe public views
- custom URLs for different customers
- cleaner proposal copy

## File location

This guide is saved at:

[HOW_TO_USE.md](/Users/markwhittenburg/Documents/New%20project/HOW_TO_USE.md)
