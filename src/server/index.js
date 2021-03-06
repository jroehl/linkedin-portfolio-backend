import { addMenu } from './menu';
import { showWebhooks, showAbout, showSetup, showError } from './ui';
import {
  deleteTriggerById,
  getTriggersData,
  addWebhookTrigger,
  onEditWebhook,
  validateSectionsSheet
} from './trigger';
import { importData } from './import';
import { createSectionsSheet } from './sections';
import config from '../config';
import { publishToWeb, error, info, log } from './server-utils';

global.onOpen = addMenu;

global.showWebhooks = showWebhooks;
global.showAbout = showAbout;
global.getTriggersData = () => JSON.stringify(getTriggersData());
global.addWebhookTrigger = addWebhookTrigger;
global.deleteTriggerById = deleteTriggerById;

global.createSectionsSheet = createSectionsSheet;

global.showSetup = showSetup;
global.importData = data => importData(JSON.parse(data));

global.publishToWeb = publishToWeb;

global.getMeta = () => ({
  spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
  ...config
});

global.onEditWebhook = onEditWebhook;
global.validateSectionsSheet = validateSectionsSheet;

global.showError = showError;

global.error = error;
global.info = info;
global.log = log;
