document.addEventListener('DOMContentLoaded', function() {
    const togglePdf1Btn = document.getElementById('togglePdf1');
    const togglePdf2Btn = document.getElementById('togglePdf2');
    const pdfContainer1 = document.getElementById('pdfContainer1');
    const pdfContainer2 = document.getElementById('pdfContainer2');
    const pdfContainerBoth = document.getElementById('pdfContainerBoth');

    let pdf1Visible = false;
    let pdf2Visible = false;

    function updateVisibility() {
        if (pdf1Visible && pdf2Visible) {
            pdfContainer1.style.display = 'none';
            pdfContainer2.style.display = 'none';
            pdfContainerBoth.style.display = 'flex';
        } else {
            pdfContainerBoth.style.display = 'none';
            pdfContainer1.style.display = pdf1Visible ? 'flex' : 'none';
            pdfContainer2.style.display = pdf2Visible ? 'flex' : 'none';
        }
    }

    togglePdf1Btn.addEventListener('click', function() {
        pdf1Visible = !pdf1Visible;
        updateVisibility();
    });

    togglePdf2Btn.addEventListener('click', function() {
        pdf2Visible = !pdf2Visible;
        updateVisibility();
    });
});


document.addEventListener('DOMContentLoaded', function(){
    $('[data-bs-toggle="collapse"]').on( "click", function() {
      $(this).toggleClass("active");
      $(this).text(function(i, text) {
        return text.includes('Show') ? text.replace('Show', 'Hide') : text.replace('Hide', 'Show');
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function(){
    $('[data-bs-toggle="button"]').on( "click", function() {
      $(this).toggleClass("active");
      $(this).text(function(i, text) {
        return text.includes('Show') ? text.replace('Show', 'Hide') : text.replace('Hide', 'Show');
      });
    });
  });
