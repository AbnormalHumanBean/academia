// Import the Bootstrap bundle
//
// This includes Popper and all of Bootstrap's JS plugins.
import * as bootstrap from 'bootstrap'
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
    skill.querySelector('.skill-value').textContent = "lvl." + value;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Example usage on a page with skills
  let skillsSelector = '#skills-list .skill';
  updateProgressBars(skillsSelector);
});

