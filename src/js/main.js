// Import the Bootstrap bundle
//
// This includes Popper and all of Bootstrap's JS plugins.
import * as bootstrap from 'bootstrap'
import '../scss/styles.scss'
import '../css/additions.css';
import './color-modes.js';


// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new bootstrap.Popover(popover)
  })
// Initialize tooltip
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

function updateProgressBars(selector) {
  let skills = document.querySelectorAll(selector);
  skills.forEach(skill => {
    let value = skill.dataset.value;
    let progressBar = skill.querySelector('.progress-bar');
    progressBar.style.width = value + '%';
    progressBar.setAttribute('aria-valuenow', value);
    skill.querySelector('.skill-value').textContent = "lvl. " + value;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Example usage on a page with skills
  let skillsSelector = '#skills-list .skill';
  updateProgressBars(skillsSelector);
});

import fs from 'fs';
import PDFDocument from 'pdfkit';
import ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import { waitForData } from './pdfkitHelpers.js';
import { fetchFile } from './httpHelpers.js';
// testImage is an URL
// bundle font and image files and register them in the virtual fs
import './registerStaticFiles.js';

v
fetchFile(testImageURL)
  .then(testImageData => {
    fs.writeFileSync('images/test.jpg', testImageData);
  })
  .catch(error => {
    console.error(error);
  });

var initialFnCode = `// create a document
var doc = new PDFDocument();

// waitForData must be called before call to doc.end()
waitForData(doc)
  .then(dataUrl => {
    // display the document in the iframe to the right
    iframe.src = dataUrl;
  })
  .catch(error => {
    console.log(error);
  });

doc.end();`;

function executeFn(code, PDFDocument, lorem, waitForData, iframe) {
  var fn = new Function('PDFDocument', 'lorem', 'waitForData', 'iframe', code);
  fn(PDFDocument, lorem, waitForData, iframe);
}

var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
editor.setValue(initialFnCode);
editor
  .getSession()
  .getSelection()
  .clearSelection();

var iframe = document.querySelector('iframe');

executeFn(initialFnCode, PDFDocument, lorem, waitForData, iframe);

editor.getSession().on('change', function() {
  try {
    executeFn(editor.getValue(), PDFDocument, lorem, waitForData, iframe);
  } catch (e) {
    console.error(e);
  }
});