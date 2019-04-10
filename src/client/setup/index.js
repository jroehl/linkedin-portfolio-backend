import './index.css';

import initUploader from './uploader';
import processZip from './processZip';
import { showError } from '../client-utils';

/**
 * Initialize event listeners and uploader with meta data
 *
 * @param {object} { spreadsheetId }
 */
const init = ({ spreadsheetId }) => {
  const status = document.querySelector('form .box__status');
  const form = document.querySelector('form');
  const icon = document.querySelector('form i');
  const spreadsheetIdEl = document.querySelector(`#spreadsheetId`);

  spreadsheetIdEl.innerHTML = spreadsheetId;
  spreadsheetIdEl.onclick = () => copyStringToClipboard(spreadsheetId);

  const publishBtn = document.querySelector('#publish-btn');
  publishBtn.onclick = () => {
    publishBtn.innerHTML = 'publishing...';
    publishBtn.disabled = true;
    google.script.run
      .withSuccessHandler(() => {
        publishBtn.innerHTML = 'published';
      })
      .withFailureHandler(err => {
        showError(err);
        publishBtn.innerHTML = 'publish';
        publishBtn.false = true;
      })
      .publishToWeb();
  };

  const createBtn = document.querySelector('#create-btn');
  createBtn.onclick = () => {
    createBtn.innerHTML = 'creating...';
    createBtn.disabled = true;
    google.script.run
      .withSuccessHandler(() => {
        createBtn.innerHTML = 'created';
      })
      .withFailureHandler(err => {
        showError(err);
        createBtn.innerHTML = 'create';
        createBtn.false = true;
      })
      .createMetaSheet();
  };

  /**
   * Open the file picker manually
   *
   */
  const openFilePicker = () => document.querySelector('input[type="file"]').click();

  /**
   * Route the different uploader steps
   *
   * @param {number} [i=0]
   * @param {array<object>} res
   */
  const uploader = (i = 0, res) => {
    switch (i) {
      case 0:
        uploadFile();
        break;
      case 1:
        showSuccess(res);
        break;
      default:
        setProcessing();
        break;
    }
  };

  /**
   * Restart the uploader
   *
   * @param {Event} e
   */
  const restart = e => {
    e && e.preventDefault();
    form.classList.remove('is-error', 'is-success');
    uploader();
  };

  /**
   * Show error in uploader
   *
   * @param {Error} err
   */
  const setError = err => {
    form.classList.remove('is-success', 'is-processing');
    form.classList.add('is-error');
    status.innerHTML = `<p>Following error occured:</p><strong>${
      err.message || typeof err === 'string' ? err : JSON.stringify(err, null, 2)
    }</strong><p>Please restart</p>`;
    icon.className = 'fas fa-bomb';
    form.onclick = restart;
    google.script.run.error(err);
  };

  /**
   * Copy the string to clipboard
   *
   * @param {string} str
   */
  const copyStringToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = { position: 'absolute', left: '-9999px' };
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  /**
   * Set the uploader to processing
   *
   * @param {string} [msg='loading..']
   */
  const setProcessing = (msg = 'loading..') => {
    form.classList.remove('is-success', 'is-error');
    form.classList.toggle('is-processing');
    status.innerHTML = msg;
    icon.className = 'fas fa-circle-notch fa-spin';
    form.onclick = undefined;
  };

  /**
   * Show success message in uploader
   *
   * @param {array<object>} result
   */
  const showSuccess = result => {
    status.innerHTML = `<p>LinkedIn data successfully imported:</p><ul>${result
      .map(
        ({ name, id, insertedRows }) =>
          `<li><strong>${name}</strong> <em>(${id})</em> - ${insertedRows} rows</li>`
      )
      .join('')}</ul>`;
    icon.className = 'fas fa-check-circle';
  };

  /**
   * Upload the file to google sheets
   *
   */
  const uploadFile = () => {
    form.onclick = openFilePicker;
    initUploader((file, err) => {
      if (err) {
        setError(err);
      } else {
        setProcessing(`<a href="">"${file.name}"</a> is processing`);
        processZip(file)
          .then(res => {
            return new Promise((resolve, reject) => {
              google.script.run
                .withSuccessHandler(resolve)
                .withFailureHandler(reject)
                .importData(JSON.stringify(res));
            });
          })
          .then(res => uploader(1, res))
          .catch(setError);
      }
    });
    status.innerHTML = '<span><strong>Pick the archive "zip" file</strong> or drag it here.</span>';
    icon.className = 'fas fa-file-import';
  };

  uploader();
};

google.script.run
  .withSuccessHandler(init)
  .withFailureHandler(showError)
  .getMeta();
