/**
 * Detect if drag&drop available
 *
 * @export
 * @returns {boolean}
 */
const hasAdvancedUpload = () => {
  const div = document.createElement('div');
  return (
    ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
    'FormData' in window &&
    'FileReader' in window
  );
};

/**
 * Check if file is of correct type
 *
 * @param {array<object>} files
 * @param {function} cb
 */
const validateInput = ([file], cb) => {
  if (file.type !== 'application/zip') {
    cb(null, new Error(`File has to be a "zip" and is "${file.type}"`));
  } else {
    cb(file);
  }
};

/**
 * Add event listeners for file upload
 *
 * @param {function} cb
 */
export default cb => {
  const form = document.querySelector('form');
  const input = form.querySelector('input[type="file"]');

  input.addEventListener('change', ({ target }) => validateInput(target.files, cb));

  // Firefox focus bug fix for file input
  input.addEventListener('focus', () => input.classList.add('has-focus'));
  input.addEventListener('blur', () => input.classList.remove('has-focus'));

  if (hasAdvancedUpload()) {
    form.addEventListener('drop', ({ dataTransfer }) => validateInput(dataTransfer.files, cb));

    form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(
      event => {
        form.addEventListener(event, e => {
          // preventing the unwanted behaviours
          e.preventDefault();
          e.stopPropagation();
        });
      }
    );

    ['dragover', 'dragenter'].forEach(event => {
      form.addEventListener(event, () => form.classList.add('is-dragover'));
    });

    ['dragleave', 'dragend', 'drop'].forEach(event => {
      form.addEventListener(event, () => form.classList.remove('is-dragover'));
    });
  }
};
