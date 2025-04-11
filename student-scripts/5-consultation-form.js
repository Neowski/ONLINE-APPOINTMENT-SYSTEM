function downloadPDF() {
  const pdfUrl = "../files/5-consultation-form.pdf";
  const link = document.createElement("a");

  link.href = pdfUrl;
  link.download = "Consultation_Form.pdf";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadPDF);
  }
});
