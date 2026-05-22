Project Answers and Notes

1. How to run

Prerequisites:

- Node.js (LTS) installed — recommended v16 or newer.
- npm (bundled with Node) or an alternative package manager (yarn/pnpm).

Install dependencies:

```bash
npm install
```

Start the development server (Vite):

```bash
npm run dev
```

Notes:

- The dev server uses Vite's default port (usually `5173`) unless overridden in `vite.config.js` or via `--port`.
- To preview a production build locally after building, run:

```bash
npm run build
npm run preview
```

Deployment suggestions:

- Vercel: Connect the repo and use the default Vite build command `npm run build`.
- GitHub Pages: set `base` in `vite.config.js` and use a deploy action or `gh-pages` to publish the `dist` folder.


2. Stack and design choices

- **Core stack:** Vanilla JavaScript + Vite + small CSS utilities. Chosen to keep the bundle lightweight and remove framework-specific abstractions so the assessment focuses on interaction and information design.
- **Why Vite:** Extremely fast dev server, simple build output, and good static-hosting compatibility (Vercel, Netlify, GitHub Pages).
- **Layout approach:** A horizontally scrollable weekly grid combined with a sticky left column for habit names. This preserves context while allowing wider columns for day cells on narrow screens.
- **Today emphasis:** Today's column receives a soft background tint rather than a saturated accent color — this reduces visual noise while still making today immediately identifiable.
- **Data persistence:** `localStorage` is used for simplicity and to keep the assessment self-contained; the data model stores per-habit records keyed by date strings, which keeps read/write operations straightforward.

Design trade-offs:

Vanilla JS reduces bundle size and cognitive overhead but requires manual state handling; for larger apps a lightweight UI library would speed development.
`localStorage` is sufficient for a single-user demo but would need migration to an API or indexedDB for multi-device sync or larger datasets.

3. Responsive behavior & accessibility

- **Mobile (360px width):** The weekly grid is horizontally scrollable; columns use a `minmax()` strategy so day cells stay touch-friendly and do not compress to unusable sizes. The left habit-name column is `position: sticky` to remain visible while horizontally scrolling.
- **Desktop / large laptop (1440px):** The tracker centers in the viewport with additional horizontal padding and larger gutters for readability; columns expand up to a comfortable maximum width.

Accessibility features implemented:

- All interactive controls (checkboxes, add/remove habit buttons) are reachable via keyboard with clear focus styles.
- Visible focus outlines and larger hit targets for touch accessibility.
- Each checkbox includes an `aria-label` describing the habit and date (e.g., "Mark Running complete for 2026-05-22").
- Color choices were checked for sufficient contrast for primary states.

Accessibility improvements planned (future work):

- Add an ARIA live region to announce streak changes and weekly totals after a toggle, improving screen reader feedback.
- Provide an optional high-contrast theme and configurable font-size controls for low-vision users.

4. AI usage

- I used GitHub Copilot to speed up boilerplate: initial HTML structure, `localStorage` helper functions, and date utilities.
- Corrections and hand edits I made to AI-generated code:
  - Converted a fixed 7-column CSS layout into a responsive `minmax()`-based grid with horizontal overflow handling so cells stay large enough for touch.
  - Reduced animation duration and scale on toggle transitions to avoid visual jank when rapidly toggling habits.
  - Simplified some helpers to be synchronous and deterministic for easier debugging in the assessment scope.

5. Honest gap / future work

- The historical visualization is the least-polished area. The app currently shows an active streak count and the weekly completion state only.

Planned improvements with more time:

- Add a monthly heatmap (contribution-style) to show consistency over time; store aggregated per-day totals to drive the visualization.
- Implement export/import (JSON) so users can back up or migrate habit data.
- Add an optional server sync (simple REST endpoint) for multi-device sync and authenticated user data.

6. Files & notes

- Primary files to review: the app entry (index.html / main.js), styles (styles.css), and the localStorage helper (utils/storage.js).

