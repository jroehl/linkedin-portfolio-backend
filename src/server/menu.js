/**
 * Add the menu to the ui
 *
 * @export
 */
export const addMenu = () => {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('LinkedIn Portfolio')
    .addItem('Setup', 'showSetup')
    .addItem('Webhooks', 'showWebhooks')
    .addSeparator()
    .addItem('About', 'showAbout')
    .addToUi();
};
