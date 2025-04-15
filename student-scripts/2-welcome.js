document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.querySelector(".submit-btn");
    const adviserSelect = document.querySelector(".adviser-select");
  
    function removePlaceholder(selectElement) {
        if (selectElement.selectedIndex === 0) {
            selectElement.style.color = "gray";
        } else {
            selectElement.style.color = "black";
        }
    }
  
    if (submitButton) {
        submitButton.addEventListener("click", function () {
            const selectedAdviser = adviserSelect.value;
  
            if (selectedAdviser !== "------------------------ Adviser ------------------------") {
                window.location.href = "3-dashboard.html"; // Redirect to dashboard.html
            }
        });
    }
    
  });

  document.addEventListener('DOMContentLoaded', function () {
    // Sign Out button handler
    const signOutButton = document.querySelector('.signout');
    if (signOutButton) {
        signOutButton.addEventListener('click', function () {
            window.location.href = '../1-login.html';
        });
    }
      
});