const example_review = "https://ivannaporter.com/dist/example_review.pdf";
const example_slides = "https://ivannaporter.com/dist/example_slides.pdf";
const urlgetter = "./files"

const pdfurlC = document.querySelector('.pdfurlsel')

function getDefaultUrl() {
    if (pdfurlC && pdfurlC.id === 'example_review') {
        return example_review;
    } else if (pdfurlC && pdfurlC.id === 'example_slides') {
        return example_slides;
    } else {
        return urlgetter;
    }
}

document.addEventListener('DOMContentLoaded', () => {
   const DEFAULT_URL = getDefaultUrl();
    localStorage.setItem('DEFAULT_URL', DEFAULT_URL); // Store DEFAULT_URL in local storage
});
