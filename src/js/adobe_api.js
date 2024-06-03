
document.addEventListener("adobe_dc_view_sdk.ready", function(){ 
    var adobeDCView = new AdobeDC.View({clientId: "37247b4b3eda4e51b6a644ef06e078dc", divId: "adobe-dc-view"});
    adobeDCView.previewFile({
      content:{location: {URL: "./includes/example_review.pdf"}},
      metaData:{fileName: "Example Review"}
    }, {embedMode: "SIZED_CONTAINER"})});