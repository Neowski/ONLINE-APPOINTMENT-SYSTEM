// redirect.js

function redirectToForm() {
  var reason = document.getElementById("reason").value;
  
  if (reason === "Option 1") {
      window.location.href = "5-consultation-form.html";  // Redirect to 5-consultation-form.html
  } else {
      alert("Please select a valid reason for consultation.");  // Optional alert if no selection or invalid option
  }
}
