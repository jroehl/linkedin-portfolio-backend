import { columnToLetter } from '../utils';

/**
 * Publish the spreadsheet to the web
 *
 * @export
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

/**
 * Get the max row of column
 *
 * @param {Sheet} sheet
 * @param {number} column
 * @returns {number}
 * @export
 */
export const getMaxRow = (sheet, column) => {
  const col = columnToLetter(column);
  return sheet
    .getRange(`${col}1:${col}`)
    .getValues()
    .filter(String).length;
};

/**
 * Get the max col of row
 *
 * @param {Sheet} sheet
 * @param {number} row
 * @returns {number}
 * @export
 */
export const getMaxCol = (sheet, row) => {
  return sheet
    .getRange(`${row}:${row}`)
    .getValues()
    .filter(String).length;
};

/* eslint-disable no-console */
export const log = (...str) => console.log(...str);
export const info = (...str) => console.info(...str);
export const error = (...str) => console.error(...str);
/* eslint-enable no-console */
