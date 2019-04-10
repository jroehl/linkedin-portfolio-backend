import './index.css';
import { showError } from '../client-utils';
import { validateData } from '../../utils';

/**
 * Initialize event listeners and fill webhook list
 *
 */
const init = () => {
  const methodIpt = document.querySelector('select');
  const jsonBodyIpt = document.querySelector('textarea');
  const urlIpt = document.querySelector('input[type="url"]');
  const submitBtn = document.querySelector('input[type="submit"]');

  methodIpt.onchange = ({ target }) => {
    jsonBodyIpt.style.display = target.value === 'GET' ? 'none' : 'block';
  };

  submitBtn.onclick = () => {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Adding webhook...';
    try {
      const data = {
        method: methodIpt.value,
        url: urlIpt.value,
        payload: jsonBodyIpt.value
      };

      validateData(data);

      google.script.run
        .withSuccessHandler(updateContent)
        .withFailureHandler(showError)
        .addWebhookTrigger(data);
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Add webhook';
      showError(err);
    }
  };

  /**
   * Update the webhook list
   *
   */
  const updateContent = () => {
    submitBtn.innerHTML = 'Add webhook';
    submitBtn.disabled = false;
    jsonBodyIpt.value = '';
    urlIpt.value = '';

    google.script.run
      .withSuccessHandler(triggers => {
        const parsed = JSON.parse(triggers);
        const ul = document.querySelector('ul');
        const ids = Object.keys(parsed).filter(key => parsed[key].func === 'onEditWebhook');
        if (!ids.length) {
          ul.innerHTML = '<li><em>No webhooks installed</em></li>';
        } else {
          ul.innerHTML = '';

          ids.forEach(id => {
            const { url } = parsed[id];
            if (!url) return;
            const li = document.createElement('li');
            li.innerHTML = `\
            TRIGGER <strong>${id}</strong>
            <code>
                POST
                <a href="${url}" target="_blank">${url}</a>
            </code>`;
            const btn = document.createElement('button');
            btn.onclick = () => {
              btn.disabled = true;
              btn.innerHTML = 'deleting...';
              google.script.run
                .withSuccessHandler(updateContent)
                .withFailureHandler(err => {
                  showError(err);
                  btn.disabled = false;
                  btn.innerHTML = 'delete';
                })
                .deleteTriggerById(id);
            };
            btn.innerHTML = 'delete';
            li.append(btn);
            ul.append(li);
          });
        }
      })
      .withFailureHandler(showError)
      .getTriggersData();
  };

  updateContent();
};

init();
