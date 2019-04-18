import config from '../config';
import {
  addOnEditTrigger,
  deleteTriggerByFuncName,
  addOnChangeTrigger,
  addOnOpenTrigger
} from './trigger';
import { validateSheet } from './validators';

/**
 * Create the sections sheet
 *
 * @export
 * @returns {object}
 */
export const createSectionsSheet = () => {
  const key = config.sectionsKey;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sectionsSheet = ss.getSheetByName(key);
  if (sectionsSheet) {
    sectionsSheet.clear();
  } else {
    sectionsSheet = ss.insertSheet(key);
  }

  sectionsSheet.setTabColor('#065A82');

  const range = {
    min: {
      col: 1,
      row: 1
    },
    max: {
      col: config.sectionsWorksheet[0].length,
      row: config.sectionsWorksheet.length
    }
  };

  sectionsSheet
    .getRange(range.min.row, range.min.col, range.max.row, range.max.col)
    .setValues(config.sectionsWorksheet);

  config.headerExplanation.forEach((expl, i) => sectionsSheet.getRange(1, i + 1).setNote(expl));

  ss.addDeveloperMetadata('VALID_KEYS', config.validKeys);

  deleteTriggerByFuncName('validateSectionsSheet');

  const data = {
    range
  };

  validateSheet(sectionsSheet, true);

  addOnEditTrigger(data, 'validateSectionsSheet');
  addOnChangeTrigger(data, 'validateSectionsSheet');
  addOnOpenTrigger(data, 'validateSectionsSheet');

  ss.setActiveSheet(sectionsSheet);
  ss.moveActiveSheet(1);
  sectionsSheet.setFrozenRows(1);
  sectionsSheet.autoResizeColumns(1, range.max.col);

  return {
    name: sectionsSheet.getSheetName(),
    id: sectionsSheet.getSheetId()
  };
};
