import * as pdfjsLib from './webpack.mjs';
import * as pdfjsViewer from './pdf_viewer.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

const PDFMiniViewers = (function() {

    "use strict";

    /*
     * PDFMiniViewers global variables.
     */
    let CMAPS;
    let FONTS;
    const FULLSCREEN_FUNC = {};
    let HEIGHT;
    const ICON = {
        bookmark: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 24l-7-6-7 6v-24h14v24z"/></svg>',
        caretDown: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>',
        caretRight: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 12l-18 12v-24z"/></svg>',
        compress: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 2h2v5h7v2h-9v-7zm9 13v2h-7v5h-2v-7h9zm-15 7h-2v-5h-7v-2h9v7zm-9-13v-2h7v-5h2v7h-9z"/></svg>',
        down: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 24l-8-9h6v-15h4v15h6z"/></svg>',
        download: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>',
        erase: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm6.605-17.581l-10.677 10.68 5.658 5.659 10.676-10.682-5.657-5.657z"/></svg>',
        expand: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 9h-2v-5h-7v-2h9v7zm-9 13v-2h7v-5h2v7h-9zm-15-7h2v5h7v2h-9v-7zm9-13v2h-7v5h-2v-7h9z"/></svg>',
        fullscreen: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10.999v-10.999h-11l3.379 3.379-13.001 13-3.378-3.378v10.999h11l-3.379-3.379 13.001-13z"/></svg>',
        minus: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>',
        normalScreen: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.957 5.543l11.5 11.5-1.414 1.414-11.5-11.5 1.414-1.414zm5.043 10.699l-4.242-4.242-4.379 4.379-3.379-3.378v10.999h11l-3.379-3.379 4.379-4.379zm1-16.242l3.379 3.379-4.379 4.379 4.242 4.242 4.379-4.379 3.379 3.378v-10.999h-11z"/></svg>',
        plus: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>',
        print: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 20h-6v-1h6v1zm10-15v13h-4v6h-16v-6h-4v-13h4v-5h16v5h4zm-6 10h-12v7h12v-7zm0-13h-12v3h12v-3zm4 5.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5.224.5.5.5.5-.224.5-.5zm-6 9.5h-8v1h8v-1z"/></svg>',
        reset: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-3.31 0-6.291 1.353-8.459 3.522l-2.48-2.48-1.061 7.341 7.437-.966-2.489-2.488c1.808-1.808 4.299-2.929 7.052-2.929 5.514 0 10 4.486 10 10s-4.486 10-10 10c-3.872 0-7.229-2.216-8.89-5.443l-1.717 1.046c2.012 3.803 6.005 6.397 10.607 6.397 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/></svg>',
        up: '<svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0l8 9h-6v15h-4v-15h-6z"/></svg>'
    };
    const PDFS = {};

    const absoluteUrl = (uri) => {
        if (uri.substring(0, 4) === 'http') {
            return uri;
        }
        const relative = relativePathToAbsolute(uri);
        if (relative.endsWith('/')) {
            return window.location.origin + relative;
        }
        const last = relative.substring(relative.lastIndexOf('/'));
        // https://stackoverflow.com/a/12900504/3193156
        const file = last.slice((last.lastIndexOf(".") - 1 >>> 0) + 2);
        if (file.length > 0) {
            return window.location.origin + relative;
        }
        if (!relative.endsWith('/')) {
            return `${window.location.origin + relative}/`;
        }
        return window.location.origin + relative;
    };

    // https://stackoverflow.com/a/25833886/3193156
    var relativePathToAbsolute = (sRelPath) => {
        let nUpLn;
        const nStart = 0;
        let sDir = "";
        const sPath = location.pathname.replace(/[^\/]*$/, sRelPath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
        for (let nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
            nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
            sDir = path.join(sDir, sPath.substring(nStart, nEnd));
            sDir = sDir.replace(new RegExp(`(?:\\\/+[^\\\/]*){0,${(nUpLn - 1) / 3}}$`), "/");
        }
        return path.join(sDir, sPath.substring(nStart));
    };

    /**
     * Add a callback function (observer) to PMV to notify when a PDF goes fullscreen.
     *
     * @param {Function} func The function to register as a fullscreen observer.
     */
    const addFullscreenCallback = (func) => {
        const hash = getStringHash(func.toString());
        FULLSCREEN_FUNC[hash] = func;
    };

    /**
     * Clear the scroll check lock for the specified viewer.
     *
     * @param {Element} viewer The viewer to remover the lock from.
     */
    const clearScrollLock = (viewer) => {
        viewer.removeAttribute('data-scroll-lock');
    };

    /**
     * Convert the provided viewing area into a PMV and load the requested PDF into it.
     *
     * @param {Element} viewer The viewing area to convert into a PMV.
     */
    const convertPdfs = (viewer) => {

        const absUrl = absoluteUrl(viewer.dataset.pdf);

        // Asynchronous download PDF.
        const loadingTask = pdfjsLib.getDocument({
            url: absUrl,
            cMapUrl: CMAPS,
            cMapPacked: true,
            enableXfa: true,
            standardFontDataUrl: FONTS
        });

        // Convert the viewing area into a PMV and display the PDF.
        loadingTask.promise.then(
            (pdf) => {

                // Store a global reference to this viewer.
                const id = `H${hashCode(absoluteUrl(viewer.dataset.pdf))}`;
                pdf.src = absUrl;
                pdf.srcHash = id;
                PDFS[id] = pdf;

                // LOAD history (annotations) now so they are available as the pages are loaded.
                const history = localStorage.getItem(id);
                if (history) {
                    const json = JSON.parse(history);
                    Object.entries(json).forEach((entry) => {
                        // 0 = key
                        // 1 = value (object)
                        pdf.annotationStorage.setValue(entry[0], entry[1]);
                    });
                }

                // Destroy PDF history when a reset button is pressed.
                pdf.annotationStorage.onResetModified = function() {
                    localStorage.removeItem(pdf.srcHash);
                    this._storage = new Map(); // This is a hack!?
                    // TODO: How to properly handle this? Annotations does not provided a better way.
                    rerenderPDF(pdf.srcHash);
                };

                // Make the PMV container for this PDF.
                const container = document.createElement('DIV');
                container.id = id;
                container.classList.add('pdf-mini-viewer');

                // Swap the users HTML with our PMV container.
                viewer.parentNode.insertBefore(container, viewer);
                viewer.parentNode.removeChild(viewer);
                viewer.dataset.id = id;
                viewer.dataset.zoom = '0.00';
                viewer.classList.add('pdf-viewer');
                viewer.style.height = HEIGHT;
                viewer.addEventListener('scroll', debounce(updateCurrentPage, 500), true);
                viewer.addEventListener('click', goToBookmark, false);

                // Add the controls for this PMW container.
                const mainToolbar = getMainToolbarHTML(pdf.numPages, viewer.dataset.options);
                const resetFormToolbar = getResetFormHTML();
                const resizeToolbar = getResizeToolbarHTML();
                container.appendChild(mainToolbar);
                container.appendChild(viewer);
                container.appendChild(resetFormToolbar);
                container.appendChild(resizeToolbar);

                // Record any padding the user may have added.
                const styles = window.getComputedStyle(viewer);
                let padding = parseInt(styles.paddingTop.replace(/\D+/g, ''));
                padding += parseInt(styles.paddingBottom.replace(/\D+/g, ''));
                viewer.dataset.scroll = padding;

                // Asynchronously load and display the PDFs bookmarks if any.
                pdf.getOutline().then(
                    renderBookmarks.bind(null, container),
                    (error) => {
                        console.error(error);
                    }
                );

                // Load and display each page of the PDF one by one.
                let loaded = 0;
                while (loaded < pdf.numPages) {
                    loaded++;
                    // Asynchronous load PDF page.
                    pdf.getPage(loaded).then(
                        loadPage.bind(null, viewer),
                        (error) => {
                            console.error(error);
                        }
                    );
                }

                // Only display the reset form button if there is a form in the PDF.
                setTimeout(() => {
                    if (viewer.querySelector('input[type="text"]') ||
                        viewer.querySelector('input[type="checkbox"]') ||
                        viewer.querySelector('input[type="radio"]') ||
                        viewer.querySelector('textarea') ||
                        viewer.querySelector('select')
                    ) {
                        resetFormToolbar.classList.add('has-form');
                    }
                }, 1500);
            },
            (error) => {
                console.error(error);
            }
        );
    };

    /**
     * A modified debounce function that limits how often expensive operations can run.
     * Code inspired by {@link https://stackoverflow.com/a/52256801/3193156|this post}.
     *
     * @param {Function} func The function to call on a debounce.
     * @param {int} delay How much time in milliseconds must pass before the function will run.
     * @return {Function} An anonymous function that calls the request function.
     */
    const debounce = (callback, wait, context) => {
        if (!Number.isInteger(wait)) {
            wait = 100;
        }
        if (wait < 100) {
            wait = 100;
        }
        let timeoutId = null;
        return (...args) => {
            const _context = context || this;
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback.apply(_context, args);
            }, wait);
        };
    };

    /**
     * Toggle the bookmark menu (sidebar) open and closed.
     */
    const eventBookmark = function() {
        const app = this.closest('.pdf-mini-viewer');
        app.classList.toggle('bookmarks-open');
    };

    /**
     * Trigger a download of the PDF.
     */
    const eventDownload = function() {
        const mini = this.closest('.pdf-mini-viewer');
        const pdf = PDFS[mini.id];
        const name = getFilename(mini);
        pdf.saveDocument(pdf.annotationStorage).then(
            // Success.
            (data) => {
                // Get the PDF as a blob.
                const getUrl = window.location;
                var url = `${getUrl.protocol}//${getUrl.host}/${getUrl.pathname.split('/')[1]}`;
                const blob = new Blob([data], {
                    type: "application/pdf"
                });
                var url = URL.createObjectURL(blob);
                // Open it in a new tab and let the browser render it for printing.
                const a = document.createElement("A");
                a.setAttribute('href', url);
                a.setAttribute('target', '_blank');
                a.setAttribute('download', name);
                console.log(a);
                a.click();
            },
            // Error.
            (e) => {
                console.error(e);
            }
        );
    };

    /**
     * Determine the full filename of the requested PDF.
     *
     * @param {Element} mini The viewer area of the current PMV.
     * @return {String} The filename of the PDF being loaded into this viewer.
     */
    var getFilename = (mini) => {
        const viewer = mini.querySelector('.pdf-viewer');
        let filename = viewer.dataset.pdf;
        if (filename.includes('/')) {
            filename = filename.substr(filename.lastIndexOf('/') + 1);
        }
        return filename.trim().replace(/ /g, '-');
    };

    /**
     * Respond to a page change event from the page selector (input).
     */
    const eventPageChange = function() {
        if (!(event.key == 'Enter' || event.keyCode == 13)) {
            return;
        }
        // Get necessary information.
        const input = this.querySelector('.current-page');
        let page = parseInt(input.value);
        const total = parseInt(this.querySelector('.page-total').innerHTML);
        // Make sure the page number is within the valid range.
        if (page < 1) {
            page = 1;
        }
        if (page > total) {
            page = total;
        }
        input.value = page;
        updatePageButtons(input, page, total);
        // Lock the viewer for scroll events; blocks the scroll event firing unnecessarily.
        const app = this.closest('.pdf-mini-viewer');
        const viewer = app.querySelector('.pdf-viewer');
        viewer.dataset.scrollLock = true;
        const pageElem = viewer.querySelector(`[data-page-number="${page}"]`);
        if (pageElem) {
            pageElem.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }
        // Disable the scroll lock.
        setTimeout(clearScrollLock.bind(null, viewer), 1000);
    };

    /**
     * Update the visual look of the page toggle arrows; disables unusable arrows.
     *
     * @param {Element} input The current page number box for the selected PMV.
     * @param {int} page The page the user tried to go to.
     * @param {int} total The highest allowed page number.
     */
    var updatePageButtons = (input, page, total) => {
        const mini = input.closest('.pdf-mini-viewer');
        const toolbar = mini.querySelector('.pdf-main-toolbar');
        if (!total || total < 1) {
            var total = parseInt(toolbar.querySelector('.page-wrapper .page-total').innerHTML);
        }
        if (page <= 1) {
            toolbar.classList.add('no-page-up');
            toolbar.classList.remove('no-page-down');
        } else if (page >= total) {
            toolbar.classList.remove('no-page-up');
            toolbar.classList.add('no-page-down');
        } else {
            toolbar.classList.remove('no-page-up');
            toolbar.classList.remove('no-page-down');
        }
    };

    const eventFormReset = (evt) => {
        const viewer = evt.target.closest('.pdf-mini-viewer');
        if (viewer) {
            const pdf = PDFS[viewer.id];
            if (pdf) {
                if (confirm('Are you sure you want to reset the forms in this PDF? Any information you entered will be lost.') === false) {
                    return;
                }
                // Trick the PDF into modified mode.
                pdf.annotationStorage.setValue('__NULL__', {
                    value: null
                });
                // Now reset it.
                pdf.annotationStorage.resetModified();
            }
        }
    };

    /**
     * Respond to the page down arrow being pressed.
     */
    const eventPageDown = function() {
        const input = this.parentElement.querySelector('.page-wrapper .current-page');
        let page = parseInt(input.value) + 1;
        const total = parseInt(this.parentElement.querySelector('.page-wrapper .page-total').innerHTML);
        if (page > total) {
            page = total;
        }
        input.value = page;
        updatePageButtons(input, page, total);
        // Lock the viewer for scroll events; blocks the scroll event firing unnecessarily.
        const app = this.closest('.pdf-mini-viewer');
        const viewer = app.querySelector('.pdf-viewer');
        viewer.dataset.scrollLock = true;
        const pageElem = viewer.querySelector(`[data-page-number="${page}"]`);
        if (pageElem) {
            pageElem.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }
        // Disable the scroll lock.
        setTimeout(clearScrollLock.bind(null, viewer), 500);
    };

    /**
     * Respond to the page up arrow being pressed.
     */
    const eventPageUp = function() {
        const input = this.parentElement.querySelector('.page-wrapper .current-page');
        let page = parseInt(input.value) - 1;
        if (page < 1) {
            page = 1;
        }
        input.value = page;
        updatePageButtons(input, page, -1);
        // Lock the viewer for scroll events; blocks the scroll event firing unnecessarily.
        const app = this.closest('.pdf-mini-viewer');
        const viewer = app.querySelector('.pdf-viewer');
        viewer.dataset.scrollLock = true;
        const pageElem = viewer.querySelector(`[data-page-number="${page}"]`);
        if (pageElem) {
            pageElem.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }
        // Disable the scroll lock.
        setTimeout(clearScrollLock.bind(null, viewer), 500);
    };

    /**
     * Respond to the print button being pressed.
     */
    const eventPrint = function() {
        // Get the PDF document from the viewers id.
        const mini = this.closest('.pdf-mini-viewer');
        const pdf = PDFS[mini.id];
        // Call the built in save method and make sure to send it the annotations for this PDF.
        pdf.saveDocument(pdf.annotationStorage).then(
            // Success.
            (data) => { // Get the PDF as a blob.
                const getUrl = window.location;
                var url = `${getUrl.protocol}//${getUrl.host}/${getUrl.pathname.split('/')[1]}`;
                const blob = new Blob([data], {
                    type: "application/pdf"
                });
                var url = URL.createObjectURL(blob);
                // Open it in a new tab and let the browser render it for printing.
                const a = document.createElement("A");
                a.target = '_blank';
                a.href = url;
                a.click();
            },
            // Error.
            (e) => {
                console.error(e);
            }
        );
    };

    /**
     * Toggle this PDF in and out of fullscreen mode.
     */
    const eventToggleFullscreen = function() {
        const mini = this.closest('.pdf-mini-viewer');
        if (mini.classList.contains('fullscreen-mode')) {
            mini.classList.remove('fullscreen-mode');
            notifyFullscreenCallbacks(false);
        } else {
            mini.classList.add('fullscreen-mode');
            notifyFullscreenCallbacks(true)
        }
    };

    /**
     * Respond to a viewers compress button being pressed.
     */
    const eventZoomCompress = function() {
        const viewer = this.closest('.pdf-mini-viewer').querySelector('.pdf-viewer');
        const zoomCtl = this.closest('.pdf-mini-viewer').querySelector('.pdf-resize-toolbar');
        viewer.dataset.fit = 'fit';
        zoomCtl.classList.remove('page-actual');
        zoomCtl.classList.add('page-fit');
        rerenderPDF(viewer.dataset.id);
    };

    /**
     * Respond to a viewers expand button being pressed.
     */
    const eventZoomExpand = function() {
        const viewer = this.closest('.pdf-mini-viewer').querySelector('.pdf-viewer');
        const zoomCtl = this.closest('.pdf-mini-viewer').querySelector('.pdf-resize-toolbar');
        viewer.dataset.fit = 'actual';
        zoomCtl.classList.add('page-actual');
        zoomCtl.classList.remove('page-fit');
        rerenderPDF(viewer.dataset.id);
    };

    /**
     * Respond to a viewers zoom button being pressed.
     */
    const eventZoomIn = function() {
        const control = this.closest('.pdf-resize-toolbar');
        const viewer = this.closest('.pdf-mini-viewer').querySelector('.pdf-viewer');
        const oldZoom = parseFloat(viewer.dataset.zoom);
        let newZoom = oldZoom + .15;
        if (newZoom > .75) {
            newZoom = .75;
        }
        if (newZoom == 0) {
            control.classList.remove('zoomed');
        } else {
            control.classList.add('zoomed');
        }
        if (oldZoom != newZoom) {
            viewer.dataset.zoom = newZoom.toFixed(2);
            rerenderPDF(viewer.dataset.id);
        }
    };

    /**
     * Respond to a viewers zoom out button being pressed.
     */
    const eventZoomOut = function() {
        const control = this.closest('.pdf-resize-toolbar');
        const viewer = this.closest('.pdf-mini-viewer').querySelector('.pdf-viewer');
        const oldZoom = parseFloat(viewer.dataset.zoom);
        let newZoom = oldZoom - .15;
        if (newZoom < -.75) {
            newZoom = -.75;
        }
        if (newZoom == 0) {
            control.classList.remove('zoomed');
        } else {
            control.classList.add('zoomed');
        }
        if (oldZoom != newZoom) {
            viewer.dataset.zoom = newZoom.toFixed(2);
            rerenderPDF(viewer.dataset.id);
        }
    };

    /**
     * Respond to a viewers zoom reset button being pressed.
     */
    const eventZoomReset = function() {
        const control = this.closest('.pdf-resize-toolbar');
        const viewer = this.closest('.pdf-mini-viewer').querySelector('.pdf-viewer');
        control.classList.remove('zoomed');
        viewer.dataset.zoom = '0.00';
        rerenderPDF(viewer.dataset.id);
    };

    /**
     * Calculate the current page number based on scroll height of the viewer.
     *
     * @param {Event} e The event object that triggered this update call.
     */
    var updateCurrentPage = (e) => {
        const view = e.srcElement;
        // Make sure to only respond to scrolls on the viewer and not scroll elements inside the PDF.
        if (!(!view.dataset.scrollLock && view.classList.contains('pdf-viewer'))) {
            return;
        }
        /*
         * 0 = Viewer top and bottom padding combined.
         * 1 = Page height.
         * 2 = Page bottom margin.
         */
        const dims = view.dataset.scroll.split(':');
        dims[0] = parseFloat(dims[0]);
        dims[1] = parseFloat(dims[1]);
        dims[2] = parseFloat(dims[2]);
        // For small PDFs this math is overkill but larger ones need the accuracy.
        const guess = ((view.scrollTop + dims[0]) / dims[1]) + 1;
        const modify = guess * dims[2];
        const page = Math.floor(((view.scrollTop + dims[0] + modify) / dims[1]) + 1);
        document.querySelector(`#${view.dataset.id} .pdf-main-toolbar .current-page`).value = page;
        updatePageButtons(view, page, -1);
    };

    /**
     * Build the HTML for annotations in this PDF; this could be form inputs, bookmarks, and links.
     *
     * @param {PDFDocumentProxy} pdf The PDF document (proxy).
     * @param {Annotation} data The annotation data for this PDF.
     * @param {PageViewport} viewport The viewport settings for this PDFs mini viewer.
     * @return {HTML} This PDFs annotations compiled to HTML.
     */
    const getAnnotationHTML = (pdf, data, viewport) => {
        switch (data.subtype.toUpperCase()) {
            case 'LINK':
                // All document links / bookmarks / anchors.
                const a = document.createElement('A');
                let href = '';
                if (data.dest) {
                    href = `#${encodeURIComponent( JSON.stringify( data.dest ) )}`;
                    a.setAttribute('target', '_self');
                } else {
                    href = data.url;
                    a.setAttribute('target', '_blank');
                }
                a.setAttribute('href', href);
                return [a, 'link-annotation'];
            case 'WIDGET':
                // Advanced elements like forms.
                return getWidgetHTML(pdf, data, viewport);
            default:
                console.warn('Unsupported annotation type. Support might be added from: https://github.com/mozilla/pdf.js/blob/master/test/unit/annotation_spec.js');
                return [document.createElement('SPAN'), ''];
        }
    };

    /**
     * Build the inline style string for PDF form combo inputs; these are
     * inputs broken up into boxes where each box should hold only one
     * character or group of characters.
     *
     * @param {Object} data The individual annotation object.
     * @param {Object} viewport The current viewport object for the viewer this annotation belongs to.
     * @return {string} The inline style string for this form element.
     */
    const getComboStyle = (data, viewport) => {
        let style = '';
        const height = ((data.rect[3] - data.rect[1]) * viewport.scale) / 2;
        if (data.comb) {
            const width = (data.rect[2] - data.rect[0]) * viewport.scale;
            const spacing = width / data.maxLen;
            style += `letter-spacing: calc(${spacing}px - 1ch); `;
            style += `font-size: ${height}px; font-family: monospace, monospace; `;
        } else if (data.defaultAppearanceData) {
            if (data.defaultAppearanceData.fontSize) {
                const size = data.defaultAppearanceData.fontSize * viewport.scale;
                style += `font-size: ${size}px; `;
            }
        } else {
            style += `font-size: ${height}px; `;
        }
        style += data.color ? `color: rgb(${data.color.join(',')});` : 'color: rgb(0,0,0);';
        return style;
    };

    var getResetFormHTML = () => {
        // Resize toolbar.
        const div = document.createElement('DIV');
        div.classList.add('pdf-reset-form-toolbar');
        // Reset.
        const elem = document.createElement('DIV');
        elem.classList.add('reset-form', 'button');
        elem.innerHTML = ICON.erase;
        elem.addEventListener('click', eventFormReset);
        div.appendChild(elem);
        return div;
    }

    /**
     * Build the HTMlf or this viewers main toolbar.
     *
     * @param {int} total The highest page in this PDF.
     * @param {String} options A string of settings the user would like this viewer to use.
     * @return {HTML} The HTML for this viewer. 
     */
    var getMainToolbarHTML = (total, options) => {
        if (!options) {
            options = '';
        }
        // Main toolbar.
        const div = document.createElement('DIV');
        div.classList.add('pdf-main-toolbar');
        div.classList.add('no-page-up');
        if (total === 1) {
            div.classList.add('single-page');
        }
        if (options.indexOf('no-download') > -1) {
            div.classList.add('no-download');
        }
        if (options.indexOf('no-print') > -1) {
            div.classList.add('no-print');
        }
        // Page up.
        let elem = document.createElement('DIV');
        elem.classList.add('page-up');
        elem.innerHTML = ICON.up;
        elem.addEventListener('click', eventPageUp);
        div.appendChild(elem);
        // Page down.
        elem = document.createElement('DIV');
        elem.classList.add('page-down');
        elem.innerHTML = ICON.down;
        elem.addEventListener('click', eventPageDown);
        div.appendChild(elem);
        // Page number.
        elem = document.createElement('DIV');
        elem.classList.add('page-wrapper');
        elem.innerHTML = `<input type="number" value="1" class="current-page" min="1" max="${total}"> <span class="page-spacer">/</span> <span class="page-total">${total}</span>`;
        elem.addEventListener('keyup', eventPageChange);
        div.appendChild(elem);
        // Download.
        elem = document.createElement('DIV');
        elem.classList.add('download');
        elem.innerHTML = ICON.download;
        elem.addEventListener('click', eventDownload);
        div.appendChild(elem);
        // Print.
        elem = document.createElement('DIV');
        elem.classList.add('print');
        elem.innerHTML = ICON.print;
        elem.addEventListener('click', eventPrint);
        div.appendChild(elem);
        // Toggle fullscreen.
        elem = document.createElement('DIV');
        elem.classList.add('open-fullscreen');
        elem.innerHTML = ICON.fullscreen;
        elem.addEventListener('click', eventToggleFullscreen);
        div.appendChild(elem);
        elem = document.createElement('DIV');
        elem.classList.add('close-fullscreen');
        elem.innerHTML = ICON.normalScreen;
        elem.addEventListener('click', eventToggleFullscreen);
        div.appendChild(elem);
        // Bookmark.
        elem = document.createElement('DIV');
        elem.classList.add('bookmark');
        elem.innerHTML = ICON.bookmark;
        elem.addEventListener('click', eventBookmark);
        div.appendChild(elem);
        // Send back toolbar.
        return div;
    };

    /**
     * Gives you access to all the PDFDocumentProxy's on the current page.
     * 
     * @returns {Object} The PDFDocumentProxy objects on the current page.
     */
    const getPdfs = () => PDFS;

    /**
     * Build the HTML for this viewers resize toolbar.
     *
     * @return {HTML} The HTML for this viewers resize toolbar. 
     */
    var getResizeToolbarHTML = () => {
        // Resize toolbar.
        const div = document.createElement('DIV');
        div.classList.add('pdf-resize-toolbar');
        // Reset.
        var elem = document.createElement('DIV');
        elem.classList.add('zoom-reset', 'button');
        elem.innerHTML = ICON.reset;
        elem.addEventListener('click', eventZoomReset);
        div.appendChild(elem);
        // Expand.
        var elem = document.createElement('DIV');
        elem.classList.add('zoom-expand', 'button');
        elem.innerHTML = ICON.expand;
        elem.addEventListener('click', eventZoomExpand);
        div.appendChild(elem);
        // Compress.
        var elem = document.createElement('DIV');
        elem.classList.add('zoom-compress', 'button');
        elem.innerHTML = ICON.compress;
        elem.addEventListener('click', eventZoomCompress);
        div.appendChild(elem);
        // Zoom in.
        var elem = document.createElement('DIV');
        elem.classList.add('zoom-in', 'button');
        elem.innerHTML = ICON.plus;
        elem.addEventListener('click', eventZoomIn);
        div.appendChild(elem);
        // Zoom out.
        var elem = document.createElement('DIV');
        elem.classList.add('zoom-out', 'button');
        elem.innerHTML = ICON.minus;
        elem.addEventListener('click', eventZoomOut);
        div.appendChild(elem);
        return div;
    };

    /**
     * Determine the size of scrollbars on this page so we can factor that into
     * all the other calculations the viewer needs to do.
     * 
     * {@link https://stackoverflow.com/a/13382873/3193156|Source for this code}.
     *
     * @return {int} The size of the scrollbar width or default to 16.
     */
    const getScrollbarWidth = () => {

        // Creating invisible container
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll'; // forcing scrollbar to appear
        outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
        document.body.appendChild(outer);

        // Creating inner element and placing it in the container
        const inner = document.createElement('div');
        outer.appendChild(inner);

        // Calculating difference between container's full width and the child width
        const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

        // Removing temporary elements from the DOM
        outer.parentNode.removeChild(outer);

        if (scrollbarWidth == 0) {
            return 16;
        }

        return scrollbarWidth;
    };

    /**
     * Generate the unique hash of a string. Used for things like the debounce function
     * to track functions easier.
     * 
     * @param {String} string The string to hash; objects and functions will be converted to
     *                        their string representations.
     * @return {String} A unique hash of the provided string.
     */
    var getStringHash = (string) => {
        let hash = 0;
        let i = 0;
        const len = string.length;
        while (i < len) {
            hash = ((hash << 5) - hash + string.charCodeAt(i++)) << 0;
        }
        if (hash < 0) {
            hash *= -1;
        }
        return hash;
    };

    /**
     * Build the HTML for advanced widgets in this PDF.
     *
     * @param {PDFDocumentProxy} pdf The PDF document (proxy).
     * @param {Annotation} data The annotation data for this PDF.
     * @param {PageViewport} viewport The viewport settings for this PDFs mini viewer.
     * @return {HTML} This PDFs advanced widget compiled to HTML.
     */
    var getWidgetHTML = (pdf, data, viewport) => {
        let elem;
        let type = '';
        let value = pdf.annotationStorage.getValue(data.id, '');
        if (value) {
            // Unpack value.
            value = value.value;
        }
        switch (data.fieldType.toUpperCase()) {
            // Button, Checkbox, and Radio.
            case 'BTN':
                elem = document.createElement('INPUT');
                elem.id = data.id;
                if (data.pushButton) {
                    elem.setAttribute('type', 'button');
                    if (data.alternativeText) {
                        elem.setAttribute('value', data.alternativeText);
                    } else {
                        elem.setAttribute('value', data.fieldName);
                    }
                    // If this is a reset button hook it up.
                    if (data.resetForm) {
                        elem.addEventListener('click', () => {
                            pdf.annotationStorage.resetModified();
                        });
                    }
                } else {
                    if (data.checkBox) {
                        elem.setAttribute('type', 'checkbox');
                        type = 'buttonWidgetAnnotation checkBox';

                        if (value === false) {
                            // Do nothing to this checkbox including setting its default value.
                            elem.checked = false;
                        } else if (value === true) {
                            elem.checked = true;
                            elem.setAttribute('value', data.exportValue);
                        } else if (data.fieldValue && data.fieldValue == data.exportValue) {
                            elem.checked = true;
                            elem.setAttribute('value', data.exportValue);
                        }
                    } else {
                        elem.setAttribute('type', 'radio');
                        type = 'buttonWidgetAnnotation radioButton';

                        if (value === false) {
                            // Do nothing to this radio including setting its default value.
                            elem.checked = false;
                        } else if (value === true) {
                            elem.checked = true;
                            elem.setAttribute('value', data.buttonValue);
                        } else if (data.fieldValue && data.fieldValue == data.buttonValue) {
                            elem.checked = true;
                            elem.setAttribute('value', data.buttonValue);
                        }
                    }
                    elem.addEventListener('change', debounce(updateAnnotationStorage, 1000, elem));
                }
                break;
                // Select and Multi-select.
            case 'CH':
                elem = document.createElement('SELECT');
                elem.id = data.id;
                if (value) {
                    if (!Array.isArray(value)) {
                        value = [value];
                    }
                } else {
                    value = [];
                }
                if (data.multiSelect) {
                    elem.setAttribute('multiple', 'multiple');
                }
                let options = '';
                for (const option of data.options) {
                    options += `<option value="${option.exportValue}"`;
                    if (value.length > 0) {
                        if (value.includes(option.exportValue)) {
                            options += ' selected="true"';
                        }
                    } else if (data.fieldValue.includes(option.exportValue)) {
                        options += ' selected="true"';
                    }
                    options += `>${option.displayValue}</option>`;
                }
                elem.innerHTML = options;
                elem.addEventListener('change', debounce(updateAnnotationStorage, 1000, elem));
                type = 'choiceWidgetAnnotation';
                break;
                // Input and Textarea.
            case 'TX':
                if (data.multiLine) {
                    elem = document.createElement('TEXTAREA');
                    elem.innerHTML = value ? value : data.fieldValue;
                } else {
                    elem = document.createElement('INPUT');
                    elem.setAttribute('type', 'text');
                    if (data.comb) {
                        elem.classList.add('comb');
                    }
                    if (value) {
                        elem.setAttribute('value', value);
                    } else {
                        elem.setAttribute('value', data.fieldValue);
                    }
                }
                elem.id = data.id;
                if (data.maxLen > 0) {
                    elem.setAttribute('maxlength', data.maxLen);
                }
                elem.addEventListener('input', debounce(updateAnnotationStorage, 1000, elem));
                type = 'textWidgetAnnotation';
                break;
            default:
                elem = document.createElement('SPAN');
                console.warn('Unsupported widget type. Support might be added from: https://github.com/mozilla/pdf.js/blob/master/test/unit/annotation_spec.js');
        }
        if (data.readOnly) {
            elem.setAttribute('disabled', '');
        }
        if (data.alternativeText) {
            elem.setAttribute('title', data.alternativeText);
            elem.setAttribute('alt', data.alternativeText);
        } else {
            elem.setAttribute('title', data.fieldName);
            elem.setAttribute('alt', data.fieldName);
        }
        elem.setAttribute('name', data.fieldName);
        elem.setAttribute('style', getComboStyle(data, viewport));
        return [elem, type];
    };

    /**
     * Jump to the selected bookmark (anchor) in the viewer.
     * 
     * NOTE: We have to create new links and click them otherwise clicking the original link
     * in the PDF will create an infinite loop of calling this function.
     *
     * @return {null} Used as a short circuit only.
     */
    var goToBookmark = function() {
        if (!(event.srcElement && event.srcElement.tagName == 'A')) {
            return;
        }
        event.preventDefault();
        // Get the bookmark (anchor) information.
        const view = this.closest('.pdf-mini-viewer').querySelector('.pdf-viewer');
        const pdf = PDFS[view.dataset.id];
        let link = event.srcElement;
        // If this is to an external site go and short circuit to avoid an infinite loop.
        if (link.target.toUpperCase() == '_BLANK') {
            const a = document.createElement('A');
            a.setAttribute('href', link.href);
            a.setAttribute('target', '_blank');
            a.click();
            return;
        }
        // Link is internal, calculate what page to go to and then scroll it into view.
        link = link.href.substr(event.srcElement.href.indexOf('#') + 1);
        link = JSON.parse(decodeURIComponent(link));
        pdf.getPageIndex(link[0]).then(
            (page) => {
                // PDFJS counts pages from 0 so add 1.
                page += 1;
                // Now calculate the location and scroll to it.
                const viewStyles = window.getComputedStyle(view);
                const pageStyles = window.getComputedStyle(view.querySelector('.page'));
                const viewMargin = parseFloat(viewStyles.marginTop.replace(/[^0-9.]/g, ''));
                const pageHeight = parseFloat(pageStyles.height.replace(/[^0-9.]/g, ''));
                const pageMargin = parseFloat(pageStyles.marginBottom.replace(/[^0-9.]/g, ''));
                let y = viewMargin;
                if (page > 1) {
                    // Go down (add) the amount of pages (including margins) as needed.
                    y += (pageHeight + pageMargin) * page;
                    // Go up (subtract) the Y coordinate of the link and this pages bottom margin.
                    y -= link[3] + pageMargin;
                    /**
                     * Be a bit more generous with how much we go up (subtract) to insure that
                     * the anchor is always in view.
                     */
                    y -= (link[3] / pageHeight) * link[3];
                    // If the anchor is near the bottom of a page be extra generous.
                    if (link[3] < (pageHeight / 2)) {
                        y -= pageMargin + link[3] / 2;
                    }
                } else {
                    y -= link[3];
                }
                view.scrollTo(link[2], y);
            }
        );
    };

    /**
     * When the users browser widow resizes we need to redraw (reload) all the
     * PDF pages to the new available size. This function will call each page
     * one by one and update them.
     */
    const handleWindowResize = () => {
        visibleConsoleLog(`Resize W:${document.body.clientWidth} H:${document.body.clientHeight}`);
        for (const prop in PDFS) {
            const viewer = document.querySelector(`.pdf-viewer[data-id="${prop}"]`);
            viewer.dataset.zoom = '0.00';
            const zoomToolbar = document.querySelector(`#${prop} .pdf-resize-toolbar`);
            zoomToolbar.classList.remove('zoomed');
            rerenderPDF(prop);
        }
    };

    /**
     * Returns a hash code from a string
     * 
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     * 
     * @param  {String} str The string to hash.
     * @returns {Number}    A 32bit integer.
     */
    var hashCode = (str) => {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            const chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    /**
     * Activate PDFMiniViewers.
     */
    const initialize = (worker, cmaps, fonts) => {
        // TODO: fonts has an issue where its relative to the worker NOT the HTML page that loaded it
        if (worker && cmaps) {
            if (pdfjsLib.getDocument) {
                // The workerSrc property must be specified.
                pdfjsLib.GlobalWorkerOptions.workerSrc = worker;
                CMAPS = absoluteUrl(cmaps);
                FONTS = absoluteUrl(fonts);
                HEIGHT = `${window.innerHeight * .70}px`;
                // Search the page for all embedded PDFs and convert them to viewers.
                const viewers = document.querySelectorAll('[data-pdf]');
                viewers.forEach((view) => {
                    // Do not convert a viewer that has already been done.
                    if (!view.dataset.id) {
                        convertPdfs(view);
                    }
                });
                // Attach window resize listener.
                window.addEventListener('resize', debounce(handleWindowResize, 500), true);
            } else {
                console.log('You must load PDF.js before you initialize PDFMiniViewers.');
            }
        } else {
            console.log('You must initialize PDFMiniViewers with the location of the [pdf.worker.js] file, the path to the [cmaps] folder, and the path to the [standard_fonts].');
        }
    };

    /**
     * Build the HTML for this viewer and load the requested PDF into it.
     *
     * @param {Element} viewer The original HTML element indicating the location to place the PMV.
     * @param {PDFPageProxy} PDFPageProxy The page data for this specific page of the PDF.
     */
    var loadPage = (viewer, PDFPageProxy) => {

        // Grab the PDFDocumentProxy object for this PDF.
        const pdf = PDFS[viewer.dataset.id];

        // Start in desktop mode using an approximation of actual size as the scale.
        let scale = 1.5;
        let mode = 'page-actual';
        const unscaledViewport = PDFPageProxy.getViewport({
            scale: 1
        });
        let browserUseableWidth = viewer.offsetWidth - getScrollbarWidth() * 3;
        browserUseableWidth = parseFloat(browserUseableWidth.toFixed(2));

        // Is the viewer small enough to be considered to be on a mobile/ handheld device? 
        if (unscaledViewport.width + 150 > browserUseableWidth || viewer.dataset.expand == '1' || viewer.dataset.fit == 'fit') {
            // Yes, change to mobile mode using page fit as the scale.
            mode = 'page-fit';
            scale = parseFloat((browserUseableWidth / unscaledViewport.width).toFixed(1));
        }

        // Set the viewers viewport scale and initial style.
        const viewport = PDFPageProxy.getViewport({
            scale
        });
        const style = `width: ${viewport.width}px; height: ${viewport.height}px;`;

        // Page container for all of this pages content.
        const page = document.createElement('DIV');
        page.classList.add('page');
        page.dataset.pageNumber = PDFPageProxy.pageNumber;
        page.ariaLabel = `Page ${PDFPageProxy.pageNumber}`;
        page.setAttribute('role', 'region');
        page.setAttribute('style', style);

        // Canvas overlay for this page.
        const canvasWrapper = document.createElement('DIV');
        canvasWrapper.classList.add('canvas-wrapper');
        canvasWrapper.setAttribute('style', style);
        const canvas = document.createElement('CANVAS');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.setAttribute('style', style);
        canvasWrapper.appendChild(canvas);

        // Text layer overlay for this page; so users can highlight text from the canvas.
        const textLayer = document.createElement('DIV');
        textLayer.classList.add('text-layer');
        textLayer.setAttribute('style', style);

        // Annotation layer overlay for this page so uses can interact with links and forms.
        const annotationLayer = document.createElement('DIV');
        annotationLayer.classList.add('annotation-layer');
        annotationLayer.setAttribute('style', style);

        // Add it all to the page.
        page.appendChild(canvasWrapper);
        page.appendChild(textLayer);
        page.appendChild(annotationLayer);

        // Add the page to the viewer.
        viewer.appendChild(page);

        // Record the padding and scrollbar information if this is the first page.
        if (PDFPageProxy.pageNumber == 1) {
            const zoomCtl = viewer.parentElement.querySelector('.pdf-resize-toolbar');
            const styles = window.getComputedStyle(page);
            const margin = styles.marginBottom.replace(/\D+/g, '');
            viewer.dataset.scroll = `${viewer.dataset.scroll}:${viewport.height}:${margin}`;
            zoomCtl.classList.add(mode);
        }

        // Render the canvas of this page; what the user visually sees as the PDF.
        const renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport,
            annotationsMode: pdfjsLib.AnnotationMode.ENABLE_STORAGE
        };
        PDFPageProxy.render(renderContext);

        // Render this pages text into the text layer element.
        PDFPageProxy.getTextContent().then(
            renderTextLayer.bind(null, textLayer, PDFPageProxy.streamTextContent(), viewport),
            (error) => {
                console.error(error);
            }
        );

        // Render this pages annotations into the annotations layer element.
        PDFPageProxy.getAnnotations().then(
            renderAnnotationLayer.bind(null, pdf, annotationLayer, viewport),
            (error) => {
                console.error(error);
            }
        );
    };

    /**
     * Notify all fullscreen observers (callback functions) that a PDF has gone fullscreen.
     *
     * @param {boolean} fullscreen True if a PDF has gone fullscreen, false if it has exited fullscreen.
     */
    var notifyFullscreenCallbacks = (fullscreen) => {
        for (const prop in FULLSCREEN_FUNC) {
            if (FULLSCREEN_FUNC[prop] != null) {
                FULLSCREEN_FUNC[prop](fullscreen);
            }
        }
    };

    /**
     * Handle reloading a page because of a resize or zoom event.
     *
     * @param {Element} viewer The viewer this PDF is loaded in.
     * @param {PDFPageProxy} PDFPageProxy The page data for this specific page of the PDF.
     */
    const reloadPage = (viewer, PDFPageProxy) => {

        visibleConsoleLog('Reloading Page');

        // Grab the PDFDocumentProxy object for this PDF.
        const pdf = PDFS[viewer.dataset.id];

        // Start in desktop mode using an approximation of actual size as the scale.
        let scale = 1.5;
        let mode = 'page-actual';
        const unscaledViewport = PDFPageProxy.getViewport({
            scale: 1
        });
        let browserUseableWidth = viewer.offsetWidth - getScrollbarWidth() * 3;
        browserUseableWidth = parseFloat(browserUseableWidth.toFixed(2));

        // Is the viewer small enough to be considered to be on a mobile/ handheld device? 
        if (unscaledViewport.width + 150 > browserUseableWidth || viewer.dataset.expand == '1' || viewer.dataset.fit == 'fit') {
            // Yes, change to mobile mode using page fit as the scale.
            mode = 'page-fit';
            scale = parseFloat((browserUseableWidth / unscaledViewport.width).toFixed(1));
        }

        // Now add in or subtract zoom.
        let zoom = parseFloat(viewer.dataset.zoom);
        if (!zoom) {
            zoom = 0;
        }
        scale += zoom;

        // Update the viewers viewport scale and style.
        const viewport = PDFPageProxy.getViewport({
            scale
        });
        const style = `width: ${viewport.width}px; height: ${viewport.height}px;`;

        // Update the page containers style.
        const page = viewer.querySelector(`.page[data-page-number="${PDFPageProxy.pageNumber}"]`);
        page.setAttribute('style', style);

        // Update scroll information; run on the first page only and use for all other pages.
        if (PDFPageProxy.pageNumber == 1) {
            const zoomCtl = viewer.parentElement.querySelector('.pdf-resize-toolbar');
            const padding = viewer.dataset.scroll.split(':')[0];
            const styles = window.getComputedStyle(page);
            const margin = styles.marginBottom.replace(/\D+/g, '');
            viewer.dataset.scroll = `${padding}:${viewport.height}:${margin}`;
            zoomCtl.classList.add(mode);
        }

        // Update the canvas wrapper styles.
        const canvasWrapper = page.querySelector('.canvas-wrapper');
        canvasWrapper.setAttribute('style', style);

        // Replace the actual canvas with a new one having the correct styles.
        const oldCanvas = canvasWrapper.querySelector('canvas');
        const newCanvas = document.createElement('CANVAS');
        newCanvas.height = viewport.height;
        newCanvas.width = viewport.width;
        newCanvas.setAttribute('style', style);
        canvasWrapper.removeChild(oldCanvas);
        canvasWrapper.appendChild(newCanvas);

        // Update the text layer styles.
        const textLayer = page.querySelector('.text-layer');
        textLayer.setAttribute('style', style);
        textLayer.innerHTML = '';

        // Update the annotation layer styles.
        const annotationLayer = page.querySelector('.annotation-layer');
        annotationLayer.setAttribute('style', style);
        annotationLayer.innerHTML = '';

        // Render the (new) canvas for this page.
        const renderContext = {
            canvasContext: newCanvas.getContext('2d'),
            viewport,
            // renderInteractiveForms: true,
            annotationsMode: pdfjsLib.AnnotationMode.ENABLE_STORAGE
        };
        PDFPageProxy.render(renderContext);

        // Update the text layer based on the PDFs new size.
        PDFPageProxy.getTextContent().then(
            renderTextLayer.bind(null, textLayer, PDFPageProxy.streamTextContent(), viewport),
            (error) => {
                console.error(error);
            }
        );

        // Update the annotation layer based on the PDFs new size. 
        PDFPageProxy.getAnnotations().then(
            renderAnnotationLayer.bind(null, pdf, annotationLayer, viewport),
            (error) => {
                console.error(error);
            }
        );
    };

    /**
     * Remove a callback function (observer) from PMV.
     *
     * @param {Function} func The function to unregister as a fullscreen observer.
     */
    const removeFullscreenCallback = (func) => {
        const hash = getStringHash(func.toString());
        FULLSCREEN_FUNC[hash] = null;
        delete FULLSCREEN_FUNC[hash];
    };

    /**
     * Receives a specific pages annotation layer data and builds the HTML
     * to display this on the page/
     *
     * @param {PDFPageProxy} pdf The PDF page (proxy).
     * @param {Element} annotationLayer The element to place the annotations HTML inside of.
     * @param {PageViewport} viewport The viewport settings for this PDFs mini viewer.
     * @param {Annotation} annotationsData The annotation data for this page.
     */
    var renderAnnotationLayer = (pdf, annotationLayer, viewport, annotationsData) => {
        let previousDest = '';
        let previousLeft = 0;
        let currentHash = '';
        for (const data of annotationsData) {
            var width = (data.rect[2] - data.rect[0]) * viewport.scale;
            const height = (data.rect[3] - data.rect[1]) * viewport.scale;
            const top = viewport.height - (data.rect[3] * viewport.scale);
            var left = data.rect[0] * viewport.scale;

            if (data.subtype.toUpperCase() == 'LINK' && data.dest) {
                currentHash = `${data.dest[0].num}:${data.dest[2]}:${data.dest[3]}`;
                // Correct dimensions for multi-line links.
                if (previousDest == currentHash) {
                    width -= previousLeft - left;
                    left = previousLeft;
                } else {
                    previousDest = currentHash;
                    previousLeft = left;
                }
            }

            // Get the HTML for this annotation.
            const html = getAnnotationHTML(pdf, data, viewport);

            if (!html[1]) {
                html[1] = 'link-annotation';
            }

            const section = document.createElement('SECTION');
            section.dataset.annotationId = data.id;
            section.setAttribute('class', html[1]);
            section.setAttribute('style', `width: ${width}px; height: ${height}px; top: ${top}px; left: ${left}px;`);
            section.appendChild(html[0]);
            annotationLayer.appendChild(section);
        }
    };

    /**
     * If bookmarks were found for this PDF create the bookmark menu otherwise hide it.
     *
     * @param {Element} container The element to place the bookmarks for this PDF.
     * @param {Array} bookmarks A multi-dimensional array of this pages bookmarks if any.
     */
    var renderBookmarks = (container, bookmarks) => {
        if (bookmarks && bookmarks.length > 0) {
            // Bookmarks can be nested.
            const results = renderBookmarksRecursively(bookmarks);
            const outline = document.createElement('DIV');
            outline.classList.add('pdf-outline');
            outline.innerHTML = results;
            outline.addEventListener('click', goToBookmark);
            outline.addEventListener('click', toggleBookmarkSubMenu);
            container.appendChild(outline);
            return;
        }
        // Hide bookmark toolbar button.
        const button = container.querySelector('.pdf-main-toolbar .bookmark');
        button.style.display = 'none';
    };

    /**
     * Render a complete branch of a bookmark; bookmarks can be nested infinitely.
     *
     * @param {Array} bookmarks A multi-dimensional array of this pages bookmarks if any.
     * @return {HTML} The HTML for an nested UL that makes up his PDFs bookmark structure.
     */
    var renderBookmarksRecursively = (bookmarks) => {
        if (bookmarks.length < 1) {
            return '';
        }
        let results = '<ul>';
        for (const bookmark of bookmarks) {
            results += '<li>';
            if (bookmark.items.length > 0) {
                results += `<div class="toggle"><div class="close">${ICON.caretRight}</div><div class="open">${ICON.caretDown}</div></div>`;
            }
            if (bookmark.url) {
                // External link.
                results += `<a href="${bookmark.url}" target="_blank" rel="noreferrer noopener">`;
                results += `${bookmark.title}</a>`;
            } else if (bookmark.dest) {
                // Internal link.
                results += `<a href="#${encodeURIComponent( JSON.stringify( bookmark.dest ) )}" target="_self">`;
                results += `${bookmark.title}</a>`;
            } else {
                // Bookmark heading.
                results += `<div class="heading">${bookmark.title}</div>`;
            }
            results += renderBookmarksRecursively(bookmark.items);
            results += '</li>';
        }
        return `${results}</ul>`;
    };

    /**
     * Asynchronous response to the text layer rendering for a page.
     *
     * @param {Element} textLayer The element to load the text content into.
     * @param {ReadableStream} stream The stream for this text content.
     * @param {PageViewport} viewport The viewport object for this viewer.
     * @param {Object} textContent Text content object holding lines of text.
     */
    var renderTextLayer = (textLayer, stream, viewport, textContent) => {
        pdfjsLib.renderTextLayer({
            textContent,
            textContentStream: stream,
            container: textLayer,
            viewport,
            textDivs: [],
            textContentItemsStr: [],
            timeout: 0
            // enhanceTextSelection: true // Depreciated
        });
    };

    /**
     * Re-render an existing PDF starting from the current page outward to
     * minimize the visual loading effect the user sees.
     *
     * @param {String} id The id of the PDF to operate on.
     */
    var rerenderPDF = (id) => {
        const pdf = PDFS[id];
        if (!pdf) {
            return;
        }
        // Setup needed variables.
        const pdfElem = document.getElementById(id);
        const viewer = pdfElem.querySelector('.pdf-viewer');
        const pages = pdfElem.querySelector('.pdf-main-toolbar .current-page');
        const current = parseInt(pages.value);
        let lower = current;
        let upper = current;
        const max = pages.max;
        let running = true;

        // Reload the current page first.
        pdf.getPage(current).then(
            reloadPage.bind(null, viewer),
            (error) => {
                console.error(error);
            }
        );

        // Loop through the remaining pages.
        while (running) {
            running = false;
            // Check for lower page.
            if (lower - 1 > 0) {
                lower--;
                running = true;
                pdf.getPage(lower).then(
                    reloadPage.bind(null, viewer),
                    (error) => {
                        console.error(error);
                    }
                );
            }
            // Check for upper page.
            if (upper + 1 <= max) {
                upper++;
                running = true;
                pdf.getPage(upper).then(
                    reloadPage.bind(null, viewer),
                    (error) => {
                        console.error(error);
                    }
                );
            }
        }
    };

    /**
     * Throttle a function call to insure that it can only run
     * once during a set period of time.
     */
    const throttle = (callback, limit, context) => {
        let lastFunc;
        let lastRan;
        return (...args) => {
            const _context = context || this;
            if (lastRan) {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        callback.apply(_context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            } else {
                callback.apply(_context, args);
                lastRan = Date.now();
            }
        };
    };

    /**
     * Toggle the bookmark menu for a viewer open and closed.
     */
    var toggleBookmarkSubMenu = () => {
        if (event.path) {
            for (const element of event.path) {
                if (element.classList.contains('toggle')) {
                    event.preventDefault();
                    element.parentElement.classList.toggle('open');
                    return;
                }
                if (element.classList.contains('pdf-outline')) {
                    break;
                }
            }
        }
    };

    /**
     * Saves any changes to form elements in a PDF form to PDFJS's annotation storage.
     * We can use this to refill the form after resize events.
     * 
     * TODO: In the future we can modify the whole storage process to save forms
     * between page reloads using local storage.
     */
    var updateAnnotationStorage = function() {
        console.log(this);
        const viewer = this.closest('.pdf-viewer');
        const pdf = PDFS[viewer.dataset.id];
        let save = '';
        // Save the data differently depending on the element type.
        switch (this.type.toUpperCase()) {
            case 'CHECKBOX':
                save = this.checked;
                break;
            case 'RADIO':
                // Save selected radio, uncheck all other radios in group, and update DOM to match.
                const current = this.id;
                var options = this.closest('.page');
                options = options.querySelectorAll(`input[type="radio"][name="${this.name}"]`);
                options.forEach((op) => {
                    if (op.id == current) {
                        save = true;
                        op.checked = true;
                    } else {
                        save = false;
                        op.checked = false;
                    }
                    pdf.annotationStorage.setValue(op.id, {
                        'value': save
                    });
                });
                return;
            case 'SELECT-ONE':
                // Save the selected option and deselect other options in the DOM.
                save = this.value;
                var options = this.options;
                for (var i = 0; i < options.length; i++) {
                    if (options[i].value == save) {
                        options[i].setAttribute('selected', 'true');
                    } else {
                        options[i].removeAttribute('selected');
                    }
                }
                break;
            case 'SELECT-MULTIPLE':
                // Find and save all selected options and deselect other options in the DOM.
                save = [];
                var options = this.options;
                for (var i = 0; i < options.length; i++) {
                    if (options[i].selected) {
                        options[i].setAttribute('selected', 'true');
                        save.push(options[i].value);
                    } else {
                        options[i].removeAttribute('selected');
                    }
                }
                // NOTE: Multi-select is not supported by PDFJS yet: https://github.com/mozilla/pdf.js/blob/d80651e5724686535ac4fbdfac5d5e280a16dbdb/src/display/annotation_layer.js#L1121
                // #12189 and #12224
                break;
            case 'TEXT': // INPUT
            case 'TEXTAREA':
                // Use the input or textarea value directly.
                save = this.value;
                break;
        }
        // Save to PDFJS's annotation storage.
        console.log('SAVE AN');
        pdf.annotationStorage.setValue(this.id, {
            'value': save
        });
        localStorage.setItem(viewer.dataset.id, JSON.stringify(pdf.annotationStorage.getAll()));

    };

    var visibleConsoleLog = (msg) => {
        const con = document.getElementById('console');
        const line = parseInt(con.dataset.line) + 1;
        con.dataset.line = line;
        con.innerHTML = `${line} ${msg}<br>${con.innerHTML}`;
    };

    return {
        'addFullscreenCallback': addFullscreenCallback,
        getPdfs,
        'initialize': initialize,
        'removeFullscreenCallback': removeFullscreenCallback
    };

})();

PDFMiniViewers.initialize('./pdf.worker.mjs', './cmaps');