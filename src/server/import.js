import config from '../config';

/**
 * Import the passed data to individual worksheets
 *
 * @export
 * @param {array<object>} files
 * @returns {array<object>}
 */
export const importData = files => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const sectionsSheet = sheets.reduce((red, sheet) => {
    if (sheet.getSheetName() === config.sectionsKey) return sheet;
    ss.deleteSheet(sheet);
    return red || sheet;
  }, null);

  const newSheets = files.map(({ normalized, parsed: { data } }) => {
    const sanitized = data.filter(row => row.length === data[0].length);
    const sheet = ss.insertSheet(normalized).setTabColor('#FF7E6B');

    sheet.getRange(1, 1, sanitized.length, sanitized[0].length).setValues(sanitized);
    sheet.setFrozenRows(1);

    return {
      name: sheet.getSheetName(),
      id: sheet.getSheetId(),
      insertedRows: sanitized.length - 1
    };
  });

  if (sectionsSheet) ss.setActiveSheet(sectionsSheet);
  return newSheets;
};
