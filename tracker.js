/*
  tracker.js
  Logs one row per page view to your Google Sheet.
  Add this to the <head> of every page on https://nramichr.github.io/ :
    <script src="https://nramichr.github.io/site-tracker/tracker.js" defer></script>
  (That address works once this folder is published as the "site-tracker"
  repo with GitHub Pages turned on. See README.md.)

  What it records: page, where the visitor came from, phone or desktop,
  and a random visit ID (so the dashboard can count unique visits).
  It does NOT record names, IP addresses, or anything personal.
*/
(function () {
  // Paste your Apps Script web app URL here (step 3 of setup)
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbzlk0-FBkV70vA2ngftuDoq9iuD2nuifX1pLrFsH2Xdw6Aw0mQd9xtaZ77MOmKhKs-t/exec";

  // Do nothing until a real Apps Script URL is pasted above
  if (!/^https:\/\/script\.google\.com\//.test(ENDPOINT)) return;

  // Don't log when you open or preview the files on your own computer
  // (covers double-clicking the file and VS Code's Live Server)
  if (location.protocol === "file:") return;
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;

  // Respect visitors who turned on "Do Not Track"
  if (navigator.doNotTrack === "1") return;

  // Visit any page once with ?notrack=1 to stop logging your own visits
  // (?notrack=0 turns logging back on for your browser)
  try {
    var flag = new URLSearchParams(location.search).get("notrack");
    if (flag === "1") localStorage.setItem("notrack", "1");
    if (flag === "0") localStorage.removeItem("notrack");
    if (localStorage.getItem("notrack") === "1") return;
  } catch (e) { /* storage blocked, keep going */ }

  // One random ID per "visit". A visit ends after 30 minutes with no page views.
  // Kept in localStorage (not per tab) so links that open in a new tab,
  // like the chapter cards on the home page, stay part of the same visit.
  var sid, now = Date.now(), VISIT_GAP = 30 * 60 * 1000;
  try {
    sid = localStorage.getItem("tk_sid");
    var last = +localStorage.getItem("tk_last") || 0;
    if (!sid || now - last > VISIT_GAP) {
      sid = Math.random().toString(36).slice(2, 10);
      localStorage.setItem("tk_sid", sid);
    }
    localStorage.setItem("tk_last", String(now));
  } catch (e) {
    sid = Math.random().toString(36).slice(2, 10);
  }

  // Where they came from: another site, your own site, or typed/bookmarked
  var ref = "direct";
  if (document.referrer) {
    var host = new URL(document.referrer).hostname.replace(/^www\./, "");
    ref = host === location.hostname.replace(/^www\./, "") ? "internal" : host;
  }

  var page = location.pathname.replace(/index\.html$/, "") || "/";
  var device = window.innerWidth < 768 ? "mobile" : "desktop";

  var data = JSON.stringify({ page: page, ref: ref, device: device, sid: sid });

  // sendBeacon still delivers if the visitor clicks away right away
  if (navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, data);
  } else {
    fetch(ENDPOINT, { method: "POST", body: data, keepalive: true });
  }
})();
