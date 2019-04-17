/**
 * Check if url is valid
 *
 * @param {string} str
 * @returns {boolean}
 */
export const isValidUrl = str => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
};

/**
 * Check if string is valid json
 *
 * @param {string} str
 * @returns {boolean}
 */
export const isValidJSON = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validate data for webhook
 *
 * @param {object} data
 * @throws {Error}
 */
export const validateData = data => {
  if (!isValidUrl(data.url)) {
    throw new Error(`"${data.url || 'undefined'}" is not a valid url`);
  }

  if (!['GET', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(data.method)) {
    throw new Error(`"${data.method}" is not a valid http request method`);
  }

  if (data.method !== 'GET' && !isValidJSON(data.payload)) {
    throw new Error(`"${data.payload}" is not a valid payload`);
  }
};

/**
 * Convert string to Camel Case
 * @param {string} s
 * @returns {string}
 */
export const toCamelCase = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/**
 * Normalize string to camel case with whitespace
 * @param {string} key
 * @returns {string}
 */
export const normalizeKey = key => {
  const parts = key.split('_');
  return parts.map(toCamelCase).join(' ');
};
