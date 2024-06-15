import * as pdfjsLib from './webpack.mjs';
import * as pdfjsViewer from './pdf_viewer.mjs';


function initializePdfViewer(defaultUrl) {
    console.log("Loading PDF from URL:", defaultUrl);

    // Setting worker path to worker bundle.
    pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";
    
    const ENABLE_XFA = true;
    const SEARCH_FOR = ""; // try "Mozilla";

    const SANDBOX_BUNDLE_SRC = "./pdf.sandbox.mjs"

    const container = document.getElementById("viewerContainer");

    const eventBus = new pdfjsViewer.EventBus();


    // (Optionally) enable hyperlinks within PDF files.
    const pdfLinkService = new pdfjsViewer.PDFLinkService({
        eventBus,
    });


    // (Optionally) enable find controller.
    const pdfFindController = new pdfjsViewer.PDFFindController({
        eventBus,
        linkService: pdfLinkService,
        updateMatchesCountOnProgress: true,
    });

    // (Optionally) enable scripting support.
    const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
        eventBus,
        sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
    });

    const pdfViewer = new pdfjsViewer.PDFViewer({
        container,
        eventBus,
        linkService: pdfLinkService,
        findController: pdfFindController,
        scriptingManager: pdfScriptingManager,
    });
    pdfLinkService.setViewer(pdfViewer);
    pdfScriptingManager.setViewer(pdfViewer);

    eventBus.on("pagesinit", () => {
        // We can use pdfViewer now, e.g. let's change default scale.
         pdfViewer.currentScaleValue = "page-width";
    // pdfViewer.currentScaleValue = 1;

        // We can try searching for things.
        if (SEARCH_FOR) {
            eventBus.dispatch("find", {
                type: "",
                query: SEARCH_FOR
            });
        }
    });

    eventBus.on("pagechanging", (evt) => {
        document.getElementById('go_page').value = evt.pageNumber;
    }, true);

    // Loading document.
    const loadingTask = pdfjsLib.getDocument({
        url: defaultUrl,
        enableXfa: ENABLE_XFA,
    });

    loadingTask.promise.then((pdfDocument) => {
        // Document loaded, specifying document for the viewer and
        // the (optional) linkService.
        pdfViewer.setDocument(pdfDocument);
        pdfLinkService.setDocument(pdfDocument, null);
        document.getElementById('total_pages').textContent = pdfDocument.numPages;
        document.getElementById('go_page').value = pdfViewer.currentPageNumber;

        pdfDocument.getOutline().then(
            renderBookmarks.bind( null, container ),
            function( error ) {
                console.error( error );
            }
        );
    });

    document.getElementById('prev').addEventListener('click', onPrevPage);
    document.getElementById('next').addEventListener('click', onNextPage);
    document.getElementById('zoom_in').addEventListener('click', onZoomIn);
    document.getElementById('zoom_out').addEventListener('click', onZoomOut);
    document.getElementById('download').addEventListener('click', onDownload);
  
    function onPrevPage() {
        if (pdfViewer.currentPageNumber <= 1) {
            return;
        }
        pdfViewer.currentPageNumber--;
        document.getElementById('go_page').value = pdfViewer.currentPageNumber;
    }

    function onNextPage() {
        if (pdfViewer.currentPageNumber >= pdfViewer.pagesCount) {
            return;
        }
        pdfViewer.currentPageNumber++;
        document.getElementById('go_page').value = pdfViewer.currentPageNumber;
    }

    function onZoomIn() {
        let newScale = pdfViewer.currentScale;
        newScale += 0.25; // Change this value as you need
        if (newScale > 10) return; // Maximum scale limit
        pdfViewer.currentScaleValue = newScale;
        document.getElementById('zoom_lvl').textContent = `${pdfViewer.currentScaleValue * 100}%`;
    }

    function onZoomOut() {
        let newScale = pdfViewer.currentScale;
        newScale -= 0.25; // Change this value as you need
        if (newScale < 0.25) return; // Minimum scale limit
        pdfViewer.currentScaleValue = newScale;
        document.getElementById('zoom_lvl').textContent = `${pdfViewer.currentScaleValue * 100}%`;
    }

    async function onDownload() {
        const pdfDataUrl = defaultUrl;

        // Use Fetch API to fetch the data of PDF as blob
        const response = await fetch(pdfDataUrl);
        const blob = await response.blob();

        // Create a blob URL
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.pdf'; // Set the file name here

        // Append the link to the document body
        document.body.appendChild(link);

        // Trigger click event on the link to start the download
        link.click();

        // Remove the link from the document body
        document.body.removeChild(link);
    };
};

function waitForDefaultUrl() {
    return new Promise((resolve) => {
        const storedUrl = localStorage.getItem('DEFAULT_URL');
        if (storedUrl) {
            resolve(storedUrl);
        } else {
            window.addEventListener('storage', (event) => {
                if (event.key === 'DEFAULT_URL' && event.newValue) {
                    resolve(event.newValue);
                }
            });
        }
    });
};

waitForDefaultUrl().then((defaultUrl) => {
    initializePdfViewer(defaultUrl);
}).catch((error) => {
    console.error("Error retrieving DEFAULT_URL:", error);
});
