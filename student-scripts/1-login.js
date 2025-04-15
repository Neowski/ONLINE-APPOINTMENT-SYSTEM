document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");

    // Toggle password visibility
    togglePassword.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        }
    });

    // Login form submission handling
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = passwordField.value;

            // Send POST request to backend login API
            fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.status === 'success') {
                    // Redirect to student welcome page
                    window.location.href = "../student-pages/2-welcome.html";
                } else {
                    showErrorModal();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorModal();
            });
        });
    } else {
        console.error("#loginForm not found.");
    }

    function showErrorModal() {
        const overlay = document.createElement("div");
        overlay.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000;";

        const modal = document.createElement("div");
        modal.style = "background: #f9f9f9; padding: 30px; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2); text-align: center; width: 400px; position: relative;";

        const errorIcon = document.createElement("div");
        errorIcon.innerHTML = "&#10006;";
        errorIcon.style = "font-size: 50px; color: #ff7675; border: 3px solid #ff7675; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto;";

        const errorTitle = document.createElement("p");
        errorTitle.style = "font-size: 22px; font-weight: bold; margin-bottom: 10px;";
        errorTitle.textContent = "Error";

        const errorMessage = document.createElement("p");
        errorMessage.style = "font-size: 16px; color: #555; margin-bottom: 20px;";
        errorMessage.textContent = "Authentication Failed";

        const okButton = document.createElement("button");
        okButton.style = "padding: 10px 20px; border: none; border-radius: 8px; background: #74b9ff; color: white; font-size: 16px; cursor: pointer; margin-top: 10px;";
        okButton.textContent = "OK";
        okButton.onclick = function () {
            document.body.removeChild(overlay);
        };

        modal.appendChild(errorIcon);
        modal.appendChild(errorTitle);
        modal.appendChild(errorMessage);
        modal.appendChild(okButton);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
});
