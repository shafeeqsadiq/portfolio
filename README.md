# Shafeeq Portfolio V11

Complete React/Vite portfolio based on **V10 Updated**. Earlier versions remain unchanged.

## Change from V10 Updated

Removed **Kigali Amendment Tracker** and **Open Data Watchdog** from the software projects section. The software showcase now has five projects: Patient Monitoring Dashboard, AllergenScan AI, DataWatch, StreamFuse, and Microplastic Detection.

All other features, including TrackSLAM and Swarm Simulator videos, their local thumbnails/fallbacks, the dark portfolio theme, timeline, the interactive robot, and source attribution, remain unchanged.

## Local preview (Windows Git Bash)

Extract this ZIP in `C:\Users\shafe\Desktop\Projects\ShafeeqPortfolio`, so that the new folder is `ShafeeqPortfolio/v11`. Then:

```bash
cd ~/Desktop/Projects/ShafeeqPortfolio/v11
npm ci
npm run dev -- --port 5188 --strictPort
```

Open http://localhost:5188/. Run `npm run build` before publishing. If `npm ci` fails because of a dependency/lockfile problem, try `npm install`.

## Replace the existing Vercel portfolio

See `DEPLOY-TO-VERCEL.md` for the full GitHub branch and Vercel deployment process. This is a Vite app and includes `vercel.json` with `dist` build output and SPA routing.

## Notes

The project uses media stored locally under `public/assets/`, including both robotics demonstration videos and their image fallback posters. As before, review permissions for upstream visual/design code before public deployment.
