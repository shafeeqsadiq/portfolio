# Deploy V11 on the existing Vercel portfolio

Production URL: https://shafeeqsadiq.vercel.app/
GitHub repo: https://github.com/shafeeqsadiq/portfolio

V11 is React + Vite. It replaces an older Next.js portfolio, but uses the **same GitHub repository and existing Vercel project**. Do not create a second Vercel project.

## 1. Verify V11 locally

```bash
cd ~/Desktop/Projects/ShafeeqPortfolio/v11
npm ci
npm run build
npm run dev -- --port 5188 --strictPort
```

Check http://localhost:5188/ plus project detail routes `/builds/trackslam` and `/builds/swarm`.

## 2. Prepare the existing deployment repository

The following commands assume `portfolio-deployment/` is the existing clean clone of the GitHub repository, with `main` as the production branch. If you have uncommitted changes or another branch in progress, commit/back them up first rather than discarding them.

```bash
cd ~/Desktop/Projects/ShafeeqPortfolio/portfolio-deployment
git status
git remote -v
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c deploy-v11
git rm -r -- .
tar -C ../v11 --exclude='./node_modules' --exclude='./dist' --exclude='./.git' --exclude='./.vercel' --exclude='./.env' --exclude='./.env.*' -cf - . | tar -xf -
npm ci
npm run build
git add -A
git status
git commit -m 'Deploy portfolio V11'
git push -u origin deploy-v11
```

Do NOT copy `node_modules`, `.env` files or `dist` to GitHub. If the production branch isn't `main`, change the commands to match your repository. If `deploy-v11` already exists, use another unique branch name.

## 3. Check Vercel settings for the existing project

Vercel Dashboard → existing portfolio project → Settings. Confirm:

- Git integration: `shafeeqsadiq/portfolio`, production branch `main` (or your actual production branch).
- Framework Preset: **Vite**.
- Root Directory: repository root (`./`).
- Install: `npm ci`.
- Build: `npm run build`.
- Output Directory: `dist`.

The `vercel.json` in the project includes a catch-all rewrite to `index.html` for React Router direct links.

## 4. Preview, merge, verify

Open a pull request from `deploy-v11` into the production branch. Check the Vercel preview deployment, especially mobile layout and video fallback. After the preview passes, merge. Verify the new production deployment succeeds and loads at https://shafeeqsadiq.vercel.app/.

Your old Next.js website remains recoverable from Git commit history and earlier Vercel deployments.
