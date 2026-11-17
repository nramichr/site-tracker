# Site Tracker

My own visitor tracker and dashboard. No Google Analytics.

| File | What it does | Where it goes |
| --- | --- | --- |
| index.html | The dashboard (charts, top pages, sources, live feed) | GitHub Pages (this repo) |
| tracker.js | Logs each page view | Any site I want to track (linked in every page's head) |
| Code.gs | Saves visits to a Google Sheet and hands them to the dashboard | Google Sheet > Extensions > Apps Script |
| dashboard.html | Old address, just forwards to index.html | Can be deleted |

The dashboard shows demo data until it's connected to the sheet.

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

## 3. Track a site

The site being tracked is <https://nramichr.github.io/> (repo `nramichr/nramichr.github.io`).
Add this one line inside `<head>` (just before `</head>`) on each page you want counted:

```html
<script src="https://nramichr.github.io/site-tracker/tracker.js" defer></script>
```

At minimum add it to the home page (`index.html`). Add it to the pages under `Repo/chXX/` too
if you want chapter views counted. Then commit and push that repo.

Because this repo is called `site-tracker` under the same account, the dashboard lives at
<https://nramichr.github.io/site-tracker/> and tracker.js is served from the same address.

Visit a tracked site with `?notrack=1` once to stop counting my own visits.

## Dashboard tips

- `/` or `Ctrl+K` jumps to the page filter. Filtering updates every chart.
- 7 / 30 / 90 days compares against the same length of time just before it.
- Export downloads the visible period as a CSV.
- The moon/sun button switches light and dark mode.
