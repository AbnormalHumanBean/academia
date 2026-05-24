import './font.js';
import './style.js';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Popover from 'bootstrap/js/dist/popover';
import Tab from 'bootstrap/js/dist/tab';
import Collapse from 'bootstrap/js/dist/collapse';
import Modal from 'bootstrap/js/dist/modal';
import Dropdown from 'bootstrap/js/dist/dropdown';
// Makes the auto light dark button
import './color-modes.js';

// Keep Bootstrap Data API modules alive for declarative data-bs-* behavior.
void Collapse;
void Modal;
void Dropdown;
// Initialize tooltip
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
	return new Tooltip(tooltipTriggerEl);
});

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new Popover(popoverTriggerEl))


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
			if (drop.getAttribute("href").includes("cod")) {
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
	  baseProgressBar.className = 'progress-bar bg-primary sp-pbar-shadow';
	  baseProgressBar.style.width = '0%';

	  // Create overlay progress bar
	  const overlayProgressBar = document.createElement('div');
	  overlayProgressBar.className = 'progress-bar overlay-bar ';
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


 document.addEventListener('DOMContentLoaded', createProgressBars);

let masonryModulePromise;

async function getMasonry() {
	if (!masonryModulePromise) {
		masonryModulePromise = import('masonry-layout');
	}
	const masonryModule = await masonryModulePromise;
	return masonryModule.default;
}

async function layoutMasonry(grid) {
	if (!grid) {
		return;
	}

	if (grid.masonryInstance) {
		grid.masonryInstance.layout();
		return;
	}

	const Masonry = await getMasonry();
	grid.masonryInstance = new Masonry(grid, {
		itemSelector: '.col',
		percentPosition: true,
		gutter: 16,
		columnWidth: '.col'
	});
}

document.addEventListener("DOMContentLoaded", function() {
  // Initialize Masonry for all visible grids on page load
  document.querySelectorAll('.masonry-grid').forEach(layoutMasonry);

  // Listen for Bootstrap accordion show event
  document.querySelectorAll('.accordion').forEach(acc => {
    acc.addEventListener('shown.bs.collapse', function(e) {
      // Only layout Masonry for the grid in the opened panel
      const grid = e.target.querySelector('.masonry-grid');
      if (grid) layoutMasonry(grid);
    });
  });
   document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tabBtn => {
    tabBtn.addEventListener('shown.bs.tab', function (e) {
      const tabPane = document.querySelector(e.target.getAttribute('data-bs-target'));
      if (tabPane) {
        tabPane.querySelectorAll('.masonry-grid').forEach(layoutMasonry);
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
	const modalEl = document.getElementById('evaluationsModal');
	const courseSelect = document.getElementById('courseSelect');

	if (!modalEl || !courseSelect) {
		return;
	}

	const modal = Modal.getOrCreateInstance(modalEl);
	const panels = Array.from(modalEl.querySelectorAll('.course-panel'));
	const modalBody = modalEl.querySelector('.modal-body');
	const modalHash = '#evaluations';
	let isPopstateClose = false;
	let requestedCourse = courseSelect.value;
	let requestedTab = null;

	function resetModalScroll() {
		if (modalBody) {
			modalBody.scrollTop = 0;
		}
		modalEl.scrollTop = 0;
		window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	}

	function clearActiveTabs(panel) {
		panel.querySelectorAll('.nav-link[data-bs-toggle="tab"]').forEach((tab) => {
			tab.classList.remove('active');
			tab.setAttribute('aria-selected', 'false');
		});

		panel.querySelectorAll('.tab-pane').forEach((pane) => {
			pane.classList.remove('active', 'show');
		});
	}

	function activateTabNow(tabTrigger) {
		if (!tabTrigger) return;

		const activePanel = tabTrigger.closest('.course-panel');
		if (!activePanel) return;

		clearActiveTabs(activePanel);

		const paneSelector = tabTrigger.getAttribute('data-bs-target');
		const pane = paneSelector ? activePanel.querySelector(paneSelector) : null;

		tabTrigger.classList.add('active');
		tabTrigger.setAttribute('aria-selected', 'true');

		if (pane) {
			pane.classList.add('active', 'show');
			pane.querySelectorAll('.masonry-grid').forEach(layoutMasonry);
		}
	}

	function showCourse(courseId, tabSelector = null) {
		requestedCourse = courseId;
		requestedTab = tabSelector;

		panels.forEach((panel) => {
			const isActive = panel.dataset.course === courseId;
			panel.classList.toggle('d-none', !isActive);
			if (!isActive) {
				clearActiveTabs(panel);
			}
		});

		courseSelect.value = courseId;

		const activePanel = panels.find((panel) => panel.dataset.course === courseId);
		if (!activePanel) return;

		const tabToShow = tabSelector
			? activePanel.querySelector(`[data-bs-target="${tabSelector}"]`)
			: activePanel.querySelector('.nav-link[data-bs-toggle="tab"]');

		activateTabNow(tabToShow);
		resetModalScroll();
	}

	courseSelect.addEventListener('change', () => {
		showCourse(courseSelect.value);
	});

	modalEl.addEventListener('show.bs.modal', (event) => {
		const trigger = event.relatedTarget;
		requestedCourse = trigger?.getAttribute('data-bs-course')?.replace('#', '') || courseSelect.value;
		requestedTab = trigger?.getAttribute('data-bs-tab') || null;
		showCourse(requestedCourse, requestedTab);
	});

	modalEl.addEventListener('shown.bs.modal', () => {
		resetModalScroll();
		if (location.hash !== modalHash) {
			history.pushState({ modal: true }, '', modalHash);
		}
	});

	modalEl.addEventListener('shown.bs.tab', (event) => {
		const pane = modalEl.querySelector(event.target.getAttribute('data-bs-target'));
		if (pane) {
			pane.querySelectorAll('.masonry-grid').forEach(layoutMasonry);
		}
		resetModalScroll();
	});

	window.addEventListener('hashchange', () => {
		if (location.hash !== modalHash && modalEl.classList.contains('show')) {
			modal.hide();
		}
	});

	window.addEventListener('popstate', () => {
		if (modalEl.classList.contains('show')) {
			isPopstateClose = true;
			modal.hide();
		}
	});

	modalEl.addEventListener('hidden.bs.modal', () => {
		if (isPopstateClose) {
			isPopstateClose = false;
			return;
		}
		if (location.hash === modalHash) {
			history.back();
		}
	});

	showCourse(courseSelect.value);
});
