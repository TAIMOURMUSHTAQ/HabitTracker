# Habit Tracker

A modern single-page habit tracker built with Vanilla HTML, CSS, JavaScript, and Vite. It keeps weekly progress visible at a glance with sticky habit labels, Monday-based weeks, persistent checkmarks, and streak tracking that feels lightweight on desktop and mobile.

## Features

- Add habits with Enter or the Add button.
- Rename habits inline.
- Delete habits with confirmation.
- Weekly grid for the current week and any future/past week.
- Monday-start calendar logic with visible date numbers.
- Persistent checkmarks saved in `localStorage`.
- Current day highlight and smooth toggle animation.
- Per-habit streak badges.
- Beautiful empty state with a CSS illustration.
- Responsive mobile layout with horizontal scrolling and sticky habit labels.
- Keyboard-friendly controls, focus states, and screen-reader labels.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript modules
- Vite

## Screenshots

Add screenshots here after running the app locally or deploying it:

- Desktop view placeholder
- Mobile view placeholder
- Empty state placeholder

## Local Setup

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Deployment

### GitHub Pages

This project uses a relative Vite base in `vite.config.js`, so the built files are compatible with GitHub Pages.

1. Run `npm run build`.
2. Publish the `dist/` folder to GitHub Pages.
3. If you use a GitHub Pages workflow, point it at the build output in `dist/`.

### Vercel

1. Import the repository into Vercel.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Deploy as a static site.

## Data Model

Habit data is stored in `localStorage` using this shape:

```json
{
  "habits": [
    {
      "id": "habit-id",
      "name": "Read 30 min",
      "createdAt": "2026-05-22T10:00:00.000Z"
    }
  ],
  "completions": {
    "habit-id-2026-05-22": true
  }
}
```

## Notes

- The week starts on Monday to match the grid layout used in the app.
- Streaks count backward from today and reset when today is unchecked.