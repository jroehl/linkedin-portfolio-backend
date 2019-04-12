import config from '../config';
import { addTrigger, deleteTriggerByFuncName } from './trigger';

/**
 * Create the sections sheet
 *
 * @export
 * @returns {object}
 */
export const createSectionsSheet = () => {
  const key = 'Sections';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sectionsSheet = ss.getSheetByName(key);

  if (!sectionsSheet) {
    sectionsSheet = ss.insertSheet(key);
  }

  sectionsSheet.setTabColor('#065A82');

  sectionsSheet
    .getRange(1, 1, config.sectionsWorksheet.length, config.sectionsWorksheet[0].length)
    .setValues(config.sectionsWorksheet);

  sectionsSheet.autoResizeColumns(1, config.sectionsWorksheet[0].length);

  const normalizedKeys = config.validKeys.map(({ normalized }) => normalized);

  ss.addDeveloperMetadata('VALID_KEYS', config.validKeys);

  deleteTriggerByFuncName('onEditSections');

  const data = {
    cols: config.sectionsWorksheet[0].reduce(
      (red, k, i) => ({
        ...red,
        color: k.toLowerCase().includes('color') ? [...(red.color || []), i + 1] : red.color,
        keys: k.toLowerCase() === 'keys' ? [...(red.keys || []), i + 1] : red.keys
      }),
      {}
    )
  };
  addTrigger(data, 'onEditSections');

  config.sectionsWorksheet.slice(1).forEach((row, i) => {
    data.cols.color.forEach(col => sectionsSheet.getRange(i + 2, col).setBackground(row[col - 1]));
    data.cols.keys.forEach(col => sectionsSheet.getRange(i + 2, col).setFontFamily('Courier New'));
  });

  ss.getSheets().forEach(sheet => {
    if (!normalizedKeys.includes(sheet.getSheetName())) ss.deleteSheet(sheet);
  });

  ss.setActiveSheet(sectionsSheet);
  sectionsSheet.setFrozenRows(1);

  return {
    name: sectionsSheet.getSheetName(),
    id: sectionsSheet.getSheetId()
  };
};
