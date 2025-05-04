function removePlaceholder(selectElement) {
    if (selectElement.selectedIndex === 0) {
        selectElement.style.color = "gray";
    } else {
        selectElement.style.color = "black";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.querySelector(".submit-btn");
    const adviserSelect = document.querySelector(".adviser-select");

    // Fetch advisers from API and populate dropdown
    fetch('http://127.0.0.1:8000/api/advisers/')
        .then(response => response.json())
        .then(data => {
            // Clear existing options except placeholder
            adviserSelect.innerHTML = '<option selected>------------------------ Adviser ------------------------</option>';
            data.forEach(adviser => {
                const option = document.createElement('option');
                option.value = adviser.id;
                option.textContent = `${adviser.last_name}, ${adviser.first_name}`;
                adviserSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching advisers:', error);
        });

    if (submitButton) {
        submitButton.addEventListener("click", function () {
            const selectedAdviser = adviserSelect.value;

            if (selectedAdviser !== "------------------------ Adviser ------------------------") {
                // Store selected adviser ID in localStorage
                localStorage.setItem('selectedAdviserId', selectedAdviser);
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
            window.location.href = '../login/index.html';
        });
    }

});
