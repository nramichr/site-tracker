/*
  Code.gs  (Google Apps Script, attached to a Google Sheet)
  Receives page views from tracker.js and hands them to dashboard.html.

  SETUP
  1. Make a new Google Sheet. Go to Extensions > Apps Script.
  2. Delete what's there, paste this whole file, and change SECRET_KEY below.
  3. Deploy > New deployment > type "Web app".
       Execute as: Me    Who has access: Anyone
     Copy the web app URL. Paste it into tracker.js and into the dashboard.
  If you edit this file later, use Deploy > Manage deployments > Edit > New version
  so the same URL keeps working.
*/

const SHEET_NAME = 'Visits';
const SECRET_KEY = 'change-this-to-your-own-password';

// tracker.js sends each page view here
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    getSheet_().appendRow([
      new Date(),
      clean_(d.page),
      clean_(d.ref),
      clean_(d.device),
      clean_(d.sid)
    ]);
  } catch (err) {
    // bad data gets ignored
  }
  return ContentService.createTextOutput('ok');
}

// dashboard.html reads the data here (only with the right key)
function doGet(e) {
  if (!e.parameter || e.parameter.key !== SECRET_KEY) {
    return json_({ error: 'Wrong key' });
  }
  const values = getSheet_().getDataRange().getValues().slice(1);
  const rows = values
    .filter(r => r[0] instanceof Date)
    .map(r => ({ t: r[0].toISOString(), page: r[1], ref: r[2], device: r[3], sid: r[4] }));
  return json_({ rows: rows });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Time', 'Page', 'Came from', 'Device', 'Visit ID']);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Keeps junk out of the sheet: short text only, and no spreadsheet formulas
function clean_(v) {
  let s = String(v == null ? '' : v).slice(0, 100);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
