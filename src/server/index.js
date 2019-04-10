import { addMenu } from './menu';
import { showWebhooks, showSetup, showError } from './ui';
import {
  deleteTriggerById,
  getTriggersData,
  addWebhookTrigger,
  onEditWebhook,
  onEditMeta
} from './trigger';
import { importData } from './import';
import { createMetaSheet } from './meta';
import config from '../config';
import { publishToWeb, error, info, log } from './server-utils';

global.onOpen = addMenu;

global.showWebhooks = showWebhooks;
global.getTriggersData = () => JSON.stringify(getTriggersData());
global.addWebhookTrigger = addWebhookTrigger;
global.deleteTriggerById = deleteTriggerById;

global.createMetaSheet = createMetaSheet;

global.showSetup = showSetup;
global.importData = data => importData(JSON.parse(data));

global.publishToWeb = publishToWeb;

global.getMeta = () => ({
  spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
  ...config
});

global.onEditWebhook = onEditWebhook;
global.onEditMeta = onEditMeta;

global.showError = showError;

global.error = error;
global.info = info;
global.log = log;
