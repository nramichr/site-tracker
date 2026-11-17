# Site Tracker

My own visitor tracker and dashboard. No Google Analytics.

> **About this project:** This was developed with AI (Claude Code) as practice to prepare for a
> hackathon event hosted by TechPoint in Indianapolis. I'm still learning HTML, so most of the
> code here was written by AI. I directed the project and set up the Google Sheet and GitHub Pages.

> **Demo data:** The numbers on the dashboard are made-up sample data, not real visitors.
> The tracker is not installed on any live site right now, so nothing real is being counted.
> The sample visits are generated in the browser each time the page loads.

| File | What it does | Where it goes |
| --- | --- | --- |
| index.html | The dashboard (charts, top pages, sources, live feed) | GitHub Pages (this repo) |
| tracker.js | Logs each page view | Any site I want to track (linked in every page's head) |
| Code.gs | Saves visits to a Google Sheet and hands them to the dashboard | Google Sheet > Extensions > Apps Script |
| dashboard.html | Old address, just forwards to index.html | Can be deleted |

The dashboard shows demo data until it's connected to the sheet and the tracker is added to a site.

## 1. Set up the Google Sheet

1. Make a Google Sheet, open Extensions > Apps Script, paste Code.gs.
2. Change `SECRET_KEY`, then Deploy > New deployment > Web app (Execute as: Me, Access: Anyone).
3. Copy the web app URL and paste it into tracker.js (`ENDPOINT`).

## 2. Put the dashboard on GitHub Pages

1. On github.com click **New repository**, name it `site-tracker`, keep it Public, and create it.
2. Click **uploading an existing file**, drag in everything in this folder, and click **Commit changes**.
3. Go to **Settings > Pages**. Under "Build and deployment" pick **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute the dashboard is live at `https://YOUR-USERNAME.github.io/site-tracker/`.
5. Open it, click **Connect sheet**, and enter the web app URL and secret key.
   They are saved only in your browser, never in the repo.

To update later: edit the files and upload them again (or use `git push`). Pages redeploys on its own.

## 3. Track a site (optional, not done yet)

This step is not done, which is why the dashboard runs on demo data. To track a real site,
add this one line inside `<head>` (just before `</head>`) on each page you want counted:

```html
<script src="https://nramichr.github.io/site-tracker/tracker.js" defer></script>
```

Because this repo is called `site-tracker` under the same account, the dashboard lives at
<https://nramichr.github.io/site-tracker/> and tracker.js is served from the same address.

Visit a tracked site with `?notrack=1` once to stop counting my own visits.

## Dashboard tips

- The page dropdown at the top picks one page (or "All pages"). Every card updates to show only that page.
  Clicking a row in the Top pages table picks that page too.
- 7 / 30 / 90 days compares against the same length of time just before it.
- Export downloads the visible period as a CSV.
- The moon/sun button switches light and dark mode.
