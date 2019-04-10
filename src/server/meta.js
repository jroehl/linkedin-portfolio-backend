import config from '../config';
import { addTrigger, deleteTriggerByFuncName } from './trigger';

/**
 * Create the meta sheet
 *
 * @export
 * @returns {object}
 */
export const createMetaSheet = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let metaSheet = ss.getSheetByName('Meta');

  if (!metaSheet) {
    metaSheet = ss.insertSheet('Meta');
  }

  metaSheet.setTabColor('#065A82');

  metaSheet
    .getRange(1, 1, config.metaWorksheet.length, config.metaWorksheet[0].length)
    .setValues(config.metaWorksheet);

  metaSheet.autoResizeColumns(1, config.metaWorksheet[0].length);

  const normalizedKeys = config.validKeys.map(({ normalized }) => normalized);

  deleteTriggerByFuncName('onEditMeta');

  const data = {
    cols: config.metaWorksheet[0].reduce(
      (red, key, i) => ({
        ...red,
        color: key.toLowerCase().includes('color') ? [...(red.color || []), i + 1] : red.color,
        keys: key.toLowerCase() === 'keys' ? [...(red.keys || []), i + 1] : red.keys
      }),
      {}
    )
  };
  addTrigger(data, 'onEditMeta');

  config.metaWorksheet.slice(1).forEach((row, i) => {
    data.cols.color.forEach(col => metaSheet.getRange(i + 2, col).setBackground(row[col - 1]));
    data.cols.keys.forEach(col => metaSheet.getRange(i + 2, col).setFontFamily('Courier New'));
  });

  ss.getSheets().forEach(sheet => {
    if (!normalizedKeys.includes(sheet.getSheetName())) ss.deleteSheet(sheet);
  });

  ss.setActiveSheet(metaSheet);
  metaSheet.setFrozenRows(1);

  return {
    name: metaSheet.getSheetName(),
    id: metaSheet.getSheetId()
  };
};
