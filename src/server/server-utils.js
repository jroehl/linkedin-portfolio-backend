/**
 * Publish the spreadsheet to the web
 *
 */
export const publishToWeb = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const fileId = ss.getId();
  const revisions = Drive.Revisions.list(fileId);
  const { items } = revisions;
  const revisionId = items[items.length - 1].id;
  const resource = Drive.Revisions.get(fileId, revisionId);
  resource.published = true;
  resource.publishAuto = true;
  resource.publishedOutsideDomain = true;
  Drive.Revisions.update(resource, fileId, revisionId);
};

/* eslint-disable no-console */
export const log = (...str) => console.log(...str);
export const info = (...str) => console.info(...str);
export const error = (...str) => console.error(...str);
/* eslint-enable no-console */
