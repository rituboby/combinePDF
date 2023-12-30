
async function combinePDFs() {
  var folderId = '1SCjT3WVw-tw0y2rKCNxihLf1AscvFUaL'; // Replace with the ID of the folder containing your PDFs
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();

  // Merge PDFs.
  const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
  const pdfLibScript = UrlFetchApp.fetch(cdnjs).getContentText();
  eval(UrlFetchApp.fetch(cdnjs).getContentText().replace(/setTimeout\(.*?,.*?(\d*?)\)/g, "Utilities.sleep($1);return t();")); // Load pdf-lib

  const pdfDoc = await PDFLib.PDFDocument.create();
  
  while (files.hasNext()) {
    var file = files.next();
    Logger.log(file.getName()+' '+file.getMimeType());
    
    if (file.getMimeType() === 'application/pdf') {
      const pdfData = await PDFLib.PDFDocument.load(new Uint8Array(file.getBlob().getBytes()));
      const pages = await pdfDoc.copyPages(pdfData, [...Array(pdfData.getPageCount())].map((_, i) => i));
      pages.forEach(page => pdfDoc.addPage(page));
    }
    
  }
  
  const bytes = await pdfDoc.save();

  // Create a PDF file.
  DriveApp.createFile(Utilities.newBlob([...new Int8Array(bytes)], MimeType.PDF, "Merged.pdf"));
}
