// Import the Bootstrap bundle
//
// This includes Popper and all of Bootstrap's JS plugins.
import * as bootstrap from 'bootstrap';
// Makes the auto light dark button
import './color-modes.js';
// Initialize tooltip
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

function updateProgressBars(selector) {
	const skills = document.querySelectorAll(selector);
	skills.forEach(skill => {
		const value = skill.dataset.value;
		const progressBar = skill.querySelector('.progress-bar');
		progressBar.style.width = `${value}%`;
		progressBar.setAttribute('aria-valuenow', value);
		skill.querySelector('.skill-value').textContent = `lvl.${value}`;
	});
};
document.addEventListener('DOMContentLoaded', function() {
	// Example usage on a page with skills
	const skillsSelector = '#skills-list .skill';
	updateProgressBars(skillsSelector);
});