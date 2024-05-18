// Import the Bootstrap bundle
//
// This includes Popper and all of Bootstrap's JS plugins.

import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";


//
// Place any custom JS here
//


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