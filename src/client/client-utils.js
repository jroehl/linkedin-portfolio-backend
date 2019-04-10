/**
 * Display an error with gas alert
 *
 * @export
 * @param {Error} err
 */
export const showError = err => google.script.run.withFailureHandler(showError).showError(err);
