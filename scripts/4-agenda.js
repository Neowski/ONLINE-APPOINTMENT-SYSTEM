// agenda.js - Redirect to Consultation Form

function redirectToForm() {
  var reasonElement = document.getElementById("reason");

  if (!reasonElement) {
      console.error("Dropdown element with id 'reason' not found.");
      return;
  }

  var selectedReason = reasonElement.value;

  if (selectedReason === "Option 1") {
      window.location.href = "5-consultation-form.html"; // Redirect to Consultation Form
  } else if (selectedReason === "") {
      alert("Please select a valid reason before proceeding.");
  }
}
