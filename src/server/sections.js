import tinycolor from 'tinycolor2';
import config from '../config';
import {
  addOnEditTrigger,
  deleteTriggerByFuncName,
  addOnChangeTrigger,
  addOnOpenTrigger
} from './trigger';

const protect = (range, name) => {
  const protection = range.protect();
  if (name) {
    const description = `Please do not set values directly - use the built-in ${name} dropdown (values will be filled in automatically)`;
    protection.setDescription(description);
    range.setNote(description);
  }
};

const validateFonts = (range, ff, fc) => {
  const fontFamily = ff || range.getFontFamily();
  const fontColor = fc || range.getFontColor();
  const background = tinycolor(fontColor).isDark() ? 'white' : 'black';
  range
    .setBackground(background)
    .setFontFamily(fontFamily)
    .setValue(`${fontFamily} | ${fontColor}`)
    .setFontColor(fontColor);
  protect(range, '"Text color" & "Font"');
};

export const cellValidator = () => {
  const validKeys = config.validSections.slice(1);
  return {
    keys: range => {
      try {
        range
          .getValue()
          .split(',')
          .forEach(k => {
            if (!validKeys.includes(k.trim())) throw new Error(`Key "${k.trim()}" is invalid`);
          });

        range.setBackground('white').clearNote();
      } catch (err) {
        range
          .setBackground('#FF7E6B')
          .setNote(
            `${err.message}\nValue must be comma separated list of \n- ${validKeys.join('\n- ')}`
          );
      }
      range.setFontFamily('Courier New');
    },
    backgroundcolor: (range, val) => {
      const background = val || range.getBackground();
      const fontColor = tinycolor(background).isDark() ? 'white' : 'black';
      range
        .setBackground(background)
        .setValue(background)
        .setFontColor(fontColor);
      protect(range, '"Fill color"');
    },
    text: validateFonts,
    headings: validateFonts
  };
};

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

  const validator = cellValidator();

  const data = {
    range,
    cols: config.sectionsWorksheet[0].reduce((red, k, i) => {
      const lowerKey = k.toLowerCase();
      const col = validator[lowerKey];
      if (!col) return red;
      return {
        ...red,
        [lowerKey]: [...(red[lowerKey] || []), i + 1]
      };
    }, {})
  };

  config.sectionsWorksheet.slice(1).forEach((row, i) => {
    Object.keys(data.cols).forEach(k => {
      const validate = validator[k];
      data.cols[k].forEach(col =>
        validate(sectionsSheet.getRange(i + 2, col), ...row[col - 1].split(' | '))
      );
    });
  });

  addOnEditTrigger(data, 'validateSectionsSheet');
  addOnChangeTrigger(data, 'validateSectionsSheet');
  addOnOpenTrigger(data, 'validateSectionsSheet');

  ss.setActiveSheet(sectionsSheet);
  sectionsSheet.setFrozenRows(1);
  sectionsSheet.autoResizeColumns(1, range.max.col);

  return {
    name: sectionsSheet.getSheetName(),
    id: sectionsSheet.getSheetId()
  };
};
