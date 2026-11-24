# Eureka! — Maths tutor (Years 9–10)

A study app for Victorian Curriculum Mathematics, Levels 9–10. Runs in the browser on a Windows laptop (Edge/Chrome) or iPad (Safari) and can be installed as an app.

## What's inside
- **25 topics** across Number, Algebra, Measurement, Space, Statistics and Probability (Year 9 and Year 10).
- **Animated, narrated lessons** for every topic — play/pause/step, captions and voice-over, built around real-life analogies (balance scales, skate ramps, sharing lollies, snowballs…).
- **Plain-English lessons**, step-by-step worked examples, common mistakes and key formulas for each topic.
- **Endless practice**: 55 question generators with full worked solutions, hints and adaptive difficulty (3 levels), plus an on-screen keypad for the iPad.
- **Mastery tracking & spaced review**: each topic has a mastery score; mastered topics come back for review after 2, 5, 10, 21, 45 days.
- **Daily plan**, mental-maths warm-up, quick challenge, topic tests, timed mock exam, printable formula sheet, term planner.
- **Motivation & tracking**: XP, levels, streaks, badges, progress charts and a PIN-protected parent dashboard with a copyable weekly summary.

Progress is stored in the browser on each device; use **Settings → Save progress file / Load progress** to move between devices.

## Develop
```bash
npm install
npm run dev      # local dev server
npm run check    # stress-tests all question generators and lesson maths
npm run build    # type-check + production build
```
Pushing to `main` deploys to GitHub Pages.

Content: `src/data/topics.ts` (lessons), `src/gens/` (question generators), `src/scenes/` (animations).
