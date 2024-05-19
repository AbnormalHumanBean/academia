// Import the Bootstrap bundle
//
// This includes Popper and all of Bootstrap's JS plugins.

import '../scss/styles.scss'
import '../css/additions.css';
// import './githubget.js';
 import './color-modes.js';
//
// Place any custom JS here
//
import * as bootstrap from 'bootstrap'


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