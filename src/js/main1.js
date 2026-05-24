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
document.querySelectorAll('[data-bs-toggle="modal"][data-bs-tab]').forEach(btn => {
  btn.addEventListener('click', function () {
    const tabSelector = btn.getAttribute('data-bs-tab');
		const courseSelector = btn.getAttribute('data-bs-course');
    const modal = document.querySelector(btn.getAttribute('data-bs-target'));
    if (!modal) return;

    // Listen for the modal to be fully shown, then switch tab
    const handler = function () {
			if (courseSelector) {
				const courseSelect = modal.querySelector('#courseSelect');
				if (courseSelect) {
					courseSelect.value = courseSelector.replace('#', '');
					courseSelect.dispatchEvent(new Event('change', { bubbles: true }));
				}
			}
			const tabTrigger = modal.querySelector(`[data-bs-target="${tabSelector}"]`);
      if (tabTrigger) {
		new Tab(tabTrigger).show();
      }
      modal.removeEventListener('shown.bs.modal', handler);
    };
    modal.addEventListener('shown.bs.modal', handler);
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
	const modalHash = '#evaluations';
	let isPopstateClose = false;

	const showCourse = (courseId) => {
		panels.forEach((panel) => {
			const isActive = panel.getAttribute('data-course') === courseId;
			panel.classList.toggle('d-none', !isActive);
			panel.style.display = isActive ? '' : 'none';
		});
		const modalBody = modalEl.querySelector('.modal-body');
		if (modalBody) {
			modalBody.scrollTop = 0;
		}
		courseSelect.value = courseId;
		const activePanel = panels.find(
			(panel) => panel.getAttribute('data-course') === courseId
		);
		const firstTab = activePanel?.querySelector(
			'.nav-link[data-bs-toggle="tab"]'
		);
		if (firstTab) {
			Tab.getOrCreateInstance(firstTab).show();
		}
	};

	courseSelect.addEventListener('change', () => {
		showCourse(courseSelect.value);
	});

	modalEl.addEventListener('shown.bs.modal', (event) => {
		const trigger = event.relatedTarget;
		const courseSelector = trigger?.getAttribute('data-bs-course');
		const tabSelector = trigger?.getAttribute('data-bs-tab');
		if (courseSelector) {
			showCourse(courseSelector.replace('#', ''));
		}
		if (tabSelector) {
			const innerTab = modalEl.querySelector(`[data-bs-target="${tabSelector}"]`);
			if (innerTab) {
				Tab.getOrCreateInstance(innerTab).show();
			}
		}
		if (location.hash === modalHash) {
			history.pushState({ modal: true }, '', modalHash);
		} else {
			location.hash = 'evaluations';
		}
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