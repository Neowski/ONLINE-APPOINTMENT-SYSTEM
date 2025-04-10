// consultation.js - Trigger PDF Download

function downloadPDF() {
  const pdfUrl = "../files/5-consultation-form.pdf";  // Correct file path
  const link = document.createElement("a");
  
  link.href = pdfUrl;
  link.download = "Consultation_Form.pdf"; // Rename the downloaded file
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Ensure button has an event listener
document.addEventListener("DOMContentLoaded", function() {
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
      downloadBtn.addEventListener("click", downloadPDF);
  }
});
