import JSZip from 'jszip';
import { parse } from 'papaparse';
import config from '../../config';

/**
 * Parse the csv strings to two dimensional array
 * @param {array<object>} input
 * @returns {promise}
 */
const parseCsv = zips => {
  return Promise.all(
    zips.map(({ zip, ...rest }) => {
      return zip.async('text').then(content => ({
        ...rest,
        name: zip.name,
        parsed: parse(content)
      }));
    })
  );
};

/**
 * Extract the needed sheet values
 * @param {object} input
 * @returns {array<object>}
 */
const extractSheets = ({ files }) => {
  return config.validKeys.reduce((red, { key, normalized }) => {
    const zip = files[`${normalized}.csv`];
    if (!zip) return red;
    return [...red, { key, normalized, zip }];
  }, []);
};

/**
 * Create create spreadsheet request according to data
 * @param {object} file
 * @param {array<object>} validKeys
 * @returns {promise}
 */
export default (file, validKeys) => {
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    return Promise.reject(new Error('The File APIs are not fully supported in this browser.'));
  }

  return new JSZip()
    .loadAsync(file)
    .then(res => extractSheets(res, validKeys))
    .then(parseCsv)
    .then(res => {
      if (!res.length) throw Error('No valid data found in zip file');
      return res;
    });
};
