# Pull-Up Counter (Easy Upload Version)

This version keeps all app source files directly under `src/` to make GitHub web upload less error-prone.

## Features
- Manual pull-up counting with four tabs: Counter, Analytics, Achievements, and Settings.
- Training totals and settings are stored locally in the browser; individual training records use IndexedDB.
- Existing saved data and JSON backups remain compatible after removing sensor mode.
- Analytics lists every saved training date with its daily total and expandable timestamped records, including older dates and imported daily totals.

## Deploy
1. Upload all files and folders in this project to a GitHub repository root.
2. Confirm the repo root shows: `src/`, `public/`, `package.json`, `vite.config.ts`, `tsconfig.app.json`.
3. Import the repo into Vercel.
4. Keep Root Directory as `./`.
5. redeploy
