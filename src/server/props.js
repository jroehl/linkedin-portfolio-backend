/**
 * Fetch the user property store
 *
 * @export
 * @returns {object}
 */
export function getPropertyStore() {
  if (!this.store) {
    this.store = PropertiesService.getUserProperties();
  }
  return this.store;
}

/**
 * Get the specified property by name
 *
 * @export
 * @param {string} propertyName
 * @returns {object}
 */
export function getProperty(propertyName) {
  return getPropertyStore().getProperty(propertyName) || '';
}

/**
 * Set the user property value by name
 *
 * @export
 * @param {string} name
 * @param {object} value
 * @returns {object}
 */
export function setProperty(name, value) {
  getPropertyStore().setProperty(name, value);
}

/**
 *
 *
 * @export
 * @param {*} propertyName
 */
export function deleteProperty(propertyName) {
  getPropertyStore().deleteProperty(propertyName);
}
