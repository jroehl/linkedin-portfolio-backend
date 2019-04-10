import { error } from './server-utils';

/**
 * Show the webhooks modal
 *
 * @export
 */
export const showWebhooks = () => {
  const html = HtmlService.createHtmlOutputFromFile('webhooks.html')
    .setWidth(800)
    .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'Setup webhooks');
};

/**
 * Show the setup modal
 *
 * @export
 */
export const showSetup = () => {
  const html = HtmlService.createHtmlOutputFromFile('setup.html')
    .setWidth(600)
    .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'Setup LinkedIn portfolio');
};

/**
 * Show the error alert
 *
 * @param {error|string} err
 * @export
 */
export const showError = err => {
  error(err);
  const ui = SpreadsheetApp.getUi();
  ui.alert('Error', err.message || err, ui.ButtonSet.OK);
};
