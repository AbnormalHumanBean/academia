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

document.addEventListener("DOMContentLoaded", function() {
	// Get current page URL path and filename
	let path = window.location.pathname;
	let page = path.split("/").pop();
 
	// Add .active class to navbar link based on current page
	let navLinks = document.querySelectorAll(".nav-link");
	let dropitem = document.querySelectorAll(".dropdown-item");


	navLinks.forEach(link => {
	  // Remove .active class if it exists
	  link.classList.remove("active");

	  // Add .active class to the link that corresponds to the current page
	  if (link.getAttribute("href") === page) {
		 link.classList.add("active");
	  }
	  });

	dropitem.forEach(drop => {
		drop.classList.remove("active");
		if (drop.getAttribute("href") === page) {
			if (drop.getAttribute("href").includes("code")) {
		const	getit =	document.getElementById("code")
				getit.classList.add("active");
			};	
			if (drop.getAttribute("href").includes("teach")){
				const	getit2 =	document.getElementById("teach")
				getit2.classList.add("active");
			};	
			};
		 });
	});
 

function createProgressBars() {
	const skills = document.querySelectorAll('.skill');

	skills.forEach(skill => {
	  const value = parseInt(skill.getAttribute('data-value'), 10);
	  const skillValueSpan = skill.querySelector('.skill-value');

	  // Create progress bar container
	  const progressContainer = document.createElement('div');
	  progressContainer.className = 'progress';

	  // Create base progress bar
	  const baseProgressBar = document.createElement('div');
	  baseProgressBar.className = 'progress-bar sp-pbar-shadow';
	  baseProgressBar.style.width = '0%';

	  // Create overlay progress bar
	  const overlayProgressBar = document.createElement('div');
	  overlayProgressBar.className = 'progress-bar overlay-bar bg-primary';
	  overlayProgressBar.style.width = '0%';

	  // Append progress bars to the container
	  progressContainer.appendChild(baseProgressBar);
	  progressContainer.appendChild(overlayProgressBar);

	  // Append the progress container to the skill div
	  skill.appendChild(progressContainer);

	  // Update the progress bars
	  updateProgressBar(baseProgressBar, overlayProgressBar, value);

	  // Update the skill value display
	  skillValueSpan.textContent = `LVL. ${value}`;
	});
 };
 
 function updateProgressBar(baseProgress, overlayProgress, value) {
	if (value <= 100) {
	  baseProgress.style.width = value + '%';
	  overlayProgress.style.width = '0%';
	} else {
	  baseProgress.style.width = '100%';
	  overlayProgress.style.width = (value - 100) + '%';
	}
 };

 // Create and update progress bars on page load
 document.addEventListener('DOMContentLoaded', createProgressBars);

