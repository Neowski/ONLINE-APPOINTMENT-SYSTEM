// Function to trigger PDF download
function downloadPDF() {
  const pdfUrl = "../files/5-consultation-form.pdf";  // Update the correct file path
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "Consultation_Form.pdf"; // Rename the file
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
