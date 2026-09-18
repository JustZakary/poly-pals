const { generateSvg, sanitizeFilename, DEFAULT_SIZE } = require('poly-pals');

const preview = document.querySelector('#preview');
const downloadButton = document.querySelector('#download');
const displaynameInput = document.querySelector('#displayname');
const shadowInput = document.querySelector('#shadow');
const sizeInput = document.querySelector('#size');
const usageCode = document.querySelector('#usage');

let currentSvg = '';
let currentFilename = 'shape.svg';

function currentSettings() {
  const displayname = displaynameInput.value;
  const shadow = shadowInput.checked;
  const size = Number(sizeInput.value);
  return { displayname, shadow, size };
}

function usageSnippet(displayname, shadow, size) {
  const nameLiteral = JSON.stringify(displayname);
  return `const { generateSvg } = require('poly-pals');

const svg = generateSvg(${nameLiteral}, {
  shadow: ${shadow},
  size: ${size},
});`;
}

function render() {
  const { displayname, shadow, size } = currentSettings();
  const validSize = Number.isFinite(size) && size > 0;
  const canGenerate = displayname.trim() !== '' && validSize;

  usageCode.textContent = usageSnippet(
    displayname.trim() || 'Your Name',
    shadow,
    validSize ? size : DEFAULT_SIZE,
  );

  if (!canGenerate) {
    currentSvg = '';
    preview.replaceChildren();
    downloadButton.disabled = true;
    return;
  }

  currentSvg = generateSvg(displayname, { shadow, size });
  currentFilename = `${sanitizeFilename(displayname)}.svg`;
  preview.innerHTML = currentSvg;
  downloadButton.disabled = false;
}

function downloadSvg() {
  if (!currentSvg) return;

  const blob = new Blob([currentSvg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = currentFilename;
  link.click();
  URL.revokeObjectURL(url);
}

sizeInput.value = String(DEFAULT_SIZE);
displaynameInput.addEventListener('input', render);
shadowInput.addEventListener('change', render);
sizeInput.addEventListener('input', render);
downloadButton.addEventListener('click', downloadSvg);
render();
