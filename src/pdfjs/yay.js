function load_pdf() {
    let url =  function updateDefaultUrl() {
      const iframe = document.querySelector('.pdfjs');
      if (iframe) {
        const id = iframe.id;
        const pdf_url = `./dist/${id}`;
        const pdf_url2 = `'${pdf_url}'`;
        return pdf_url2 }
        else {
        return 'broken'}};
        
    let self = this
    this.setTitleUsingUrl(url)
    // Loading document.
    let loadingTask = pdfjsLib.getDocument({
      url: url,
      withCredentials: true,
      maxImageSize: MAX_IMAGE_SIZE,
      cMapPacked: CMAP_PACKED
    })
    this.pdfLoadingTask = loadingTask

    loadingTask.onProgress = function (progressData) {
      self.progress(progressData.loaded / progressData.total)
    }

    return loadingTask.promise.then(function (pdfDocument) {
      // Document loaded, specifying document for the viewer.
      self.pdfDocument = pdfDocument;
      self.pdfViewer.setDocument(pdfDocument)
      self.pdfLinkService.setDocument(pdfDocument)
    })}

    document.addEventListener('DOMContentLoaded', load_pdf)