const example_review = "https://ivannaporter.com/files/example_review.pdf";
const example_slides = "https://ivannaporter.com/files/example_slides.pdf";
const cv="http://127.0.0.1:5500/dist/files/CV_IvannaPorter.pdf"
const urlgetter = "./files"


const pdfurlC = document.querySelector('.pdfurlsel')

function getDefaultUrl() {
    if (pdfurlC && pdfurlC.id === 'example_review') {
        return example_review;
    } else if (pdfurlC && pdfurlC.id === 'example_slides') {
        return example_slides;
    } else if (pdfurlC && pdfurlC.id === 'cv') {
        return cv;
    }
    else {
        return urlgetter;
    }
}

document.addEventListener('DOMContentLoaded', () => {
   const DEFAULT_URL = getDefaultUrl();
    localStorage.setItem('DEFAULT_URL', DEFAULT_URL); // Store DEFAULT_URL in local storage
});
document.addEventListener('DOMContentLoaded', () => {
PDFMiniViewers.initialize( './pdf.worker.mjs, ./cmaps')});


