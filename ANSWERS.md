# Answers

## 1. How to run

Install the dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

For a production build, run `npm run build`. If you want to inspect the generated output locally, use `npm run preview` after the build.

## 2. Stack & design choices

I used Vanilla JavaScript with Vite because the app is intentionally small, interactive, and stateful without needing a framework. That keeps the bundle light, reduces abstraction overhead, and makes the deployment story simple for both GitHub Pages and Vercel.

The visual design leans on soft glassmorphism, rounded cards, calm neutrals, and a restrained accent color so the app feels polished without becoming loud. I also chose a Monday-start week because it matches the weekly habit-tracking mental model used by many planners and makes the 7-column grid feel consistent from left to right.

## 3. Responsive & accessibility

The desktop layout centers the app in a card-based shell, while the mobile layout keeps the weekly grid horizontally scrollable so the habit names stay sticky on the left. Buttons are sized for touch, the table header remains visible while scrolling, and the bottom padding leaves comfortable thumb space on smaller screens.

Accessibility was built in with semantic buttons, `aria-label` values for each checkbox-style cell, `aria-pressed` states, keyboard-friendly controls, visible focus styles, and screen-reader-only labels where needed. The contrast stays strong enough for text and controls, and the delete flow uses a confirmation dialog to prevent accidental data loss.

## 4. AI usage

AI was used as a coding assistant to accelerate the initial scaffold, help structure the modules, and draft the supporting copy for the README and answers. I then checked the behavior manually and shaped the implementation around the requirements rather than treating the first draft as final.

## 5. Honest gap

The main limitation is that the app uses `localStorage` only, so it does not sync across devices or resolve conflicts if the same habit is edited in more than one browser. That is acceptable for a lightweight single-page tracker, but a multi-device product would need a backend or sync layer.