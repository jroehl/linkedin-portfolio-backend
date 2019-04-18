import tinycolor from 'tinycolor2';
import config from '../config';
import { getMaxRow } from './server-utils';

/**
 * Protect a specific range and add note
 *
 * @param {Range} range
 * @param {string} name
 */
const protect = (range, name) => {
  const protection = range.protect();
  if (name) {
    const description = `Please do not set values directly - use the built-in ${name} dropdown (values will be filled in automatically)`;
    protection.setDescription(description);
    range.setNote(description);
  }
};

/**
 * Validate a font range
 *
 * @param {Range} range
 * @param {string} val
 */
const validateFonts = (range, val) => {
  const [ff, fc] = val ? val.split(' | ') : [];
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

const validKeys = config.validSections.slice(1);
export const validators = {
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

const validationCols = config.sectionsWorksheet[0].reduce((red, k, i) => {
  const lowerKey = k.toLowerCase();
  if (!validators[lowerKey]) return red;
  return { ...red, [i + 1]: lowerKey };
}, {});

/**
 * Validate a sheet
 *
 * @param {Sheet} sheet
 * @param {boolean} force
 * @export
 */
export const validateSheet = (sheet, force) => {
  Object.keys(validationCols).forEach(idx => {
    const validationKey = validationCols[idx];
    const validate = validators[validationKey];
    const maxRows = getMaxRow(sheet, idx);
    for (let i = 2; i <= maxRows; i += 1) {
      const range = sheet.getRange(i, idx);
      validate(range, force ? range.getValue() : undefined);
    }
  });
};

/**
 * Validate a range
 *
 * @param {Range} range
 * @export
 */
export const validateRange = range => {
  const idx = range.getColumn();
  const validationKey = validationCols[idx];
  const validate = validators[validationKey];

  if (validationKey && validate) validate(range);
};
