import { getProperty, setProperty } from './props';
import { validateData } from '../utils';
import config from '../config';
import { validateSheet, validateRange } from './validators';
import { getMaxCol } from './server-utils';

/**
 * Get the stored triggers data
 *
 * @export
 * @returns {object}
 */
export const getTriggersData = () => {
  const triggers = getProperty('triggers');
  if (triggers) return JSON.parse(triggers);
  return {};
};

/**
 * Get the stored trigger data
 *
 * @export
 * @param {string} id
 * @returns {object}
 */
export const getTriggerData = id => {
  const triggers = getTriggersData();
  return triggers[id] || {};
};

/**
 * Add the trigger data to store
 *
 * @export
 * @param {Trigger} trigger
 * @param {object} [data={}]
 */
export const addTriggerData = (trigger, data = {}) => {
  const id = trigger.getUniqueId();
  const func = trigger.getHandlerFunction();
  const triggers = getTriggersData();
  triggers[id] = {
    ...(triggers[id] || {}),
    id,
    func,
    ...data
  };
  setProperty('triggers', JSON.stringify(triggers));
};

/**
 * Delete the trigger data
 *
 * @export
 * @param {string} id
 */
export const deleteTriggerData = id => {
  const triggers = getTriggersData();
  delete triggers[id];
  setProperty('triggers', JSON.stringify(triggers));
};

/**
 * Delete the trigger by id
 *
 * @export
 * @param {string} id
 * @returns {string}
 */
export const deleteTriggerById = id => {
  return ScriptApp.getProjectTriggers().reduce((red, trigger) => {
    if (trigger.getUniqueId() === id) {
      ScriptApp.deleteTrigger(trigger);
      deleteTriggerData(id);
      return id;
    }
    return red;
  }, null);
};

/**
 * Delete the trigger by function name
 *
 * @export
 * @param {string} func
 * @returns {string}
 */
export const deleteTriggerByFuncName = func => {
  return ScriptApp.getProjectTriggers().reduce((red, trigger) => {
    if (trigger.getHandlerFunction() === func) {
      const id = trigger.getUniqueId();
      ScriptApp.deleteTrigger(trigger);
      deleteTriggerData(id);
      return id;
    }
    return red;
  }, null);
};

/**
 * Delete all triggers
 * @export
 * @returns {array<string>}
 */
export const deleteTriggers = () => Object.keys(getTriggersData()).map(deleteTriggerById);

/**
 * Add the onEdit trigger for function name
 *
 * @export
 * @param {object} data
 * @param {string} func
 */
export const addOnEditTrigger = (data, func) => {
  const ss = SpreadsheetApp.getActive();
  const trigger = ScriptApp.newTrigger(func)
    .forSpreadsheet(ss)
    .onEdit()
    .create();
  addTriggerData(trigger, data);
};

/**
 * Add the onChange trigger for function name
 *
 * @export
 * @param {object} data
 * @param {string} func
 */
export const addOnChangeTrigger = (data, func) => {
  const ss = SpreadsheetApp.getActive();
  const trigger = ScriptApp.newTrigger(func)
    .forSpreadsheet(ss)
    .onChange()
    .create();
  addTriggerData(trigger, data);
};

/**
 * Add the onOpen trigger for function name
 *
 * @export
 * @param {object} data
 * @param {string} func
 */
export const addOnOpenTrigger = (data, func) => {
  const ss = SpreadsheetApp.getActive();
  const trigger = ScriptApp.newTrigger(func)
    .forSpreadsheet(ss)
    .onOpen()
    .create();
  addTriggerData(trigger, data);
};

/**
 * Add 'onEditWebhook' trigger
 *
 * @export
 * @param {object} data
 */
export const addWebhookTrigger = data => {
  validateData(data);
  addOnEditTrigger(data, 'onEditWebhook');
};

/**
 * Trigger request for 'onEditWebhook'
 *
 * @export
 * @param {Event} evt
 */
export const onEditWebhook = evt => {
  const data = getTriggerData(evt.triggerUid);
  const requestOpts = {
    method: data.method
  };
  const { payload, ...rest } = data;
  if (data.method !== 'GET') {
    requestOpts.payload = JSON.stringify({
      meta: {
        ...rest,
        sheet: evt.range.getSheet(),
        date: new Date(),
        evt
      },
      payload: payload ? JSON.parse(payload) : undefined
    });
    requestOpts.contentType = 'application/json';
  }
  UrlFetchApp.fetch(data.url, requestOpts);
};

/**
 * Trigger range validation for 'onEditSections'
 *
 * @export
 * @param {Event} evt
 */
export const validateSectionsSheet = evt => {
  // const { triggerUid } = evt;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sectionsSheet = ss.getSheetByName(config.sectionsKey);
  if (!sectionsSheet) return;
  // const _ = getTriggerData(triggerUid);

  // const selection = sectionsSheet.getSelection();
  const activeRangeList = sectionsSheet.getActiveRangeList();

  if (activeRangeList) {
    activeRangeList.getRanges().forEach(validateRange);
  }

  // @WORKAROUND update all cells until https://issuetracker.google.com/issues/115931946 is fixed
  validateSheet(sectionsSheet);

  sectionsSheet.autoResizeColumns(1, getMaxCol(sectionsSheet, 1));
};
