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
        loginForm.addEventListener("submit", async function (event) {
            console.log("Login form submitted");  // Debug log
            const forgotModal = document.getElementById("forgot-password-modal");

            // Only proceed with login form submission if forgot password modal is NOT open
            if (forgotModal.style.display === "flex") {
                event.preventDefault(); // Prevent login form submission
                console.log("Forgot password modal open, login submission prevented");  // Debug log
                return; // Exit the function without proceeding with login
            }

            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = passwordField.value;

            console.log("Sending login request for email:", email);  // Debug log

            try {
                const response = await fetch('http://127.0.0.1:8000/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                console.log("Received response status:", response.status);  // Debug log

                if (response.ok) {
                    const data = await response.json();
                    console.log("Login successful, user type:", data.user_type);  // Debug log
                    // Redirect based on user type returned from backend
                    if (data.user_type === "student") {
                        window.location.href = "../student-pages/2-welcome.html";
                    } else if (data.user_type === "adviser") {
                        window.location.href = "../adviser-pages/2-dashboard.html";
                    } else {
                        window.location.href = "../student-pages/2-welcome.html"; // default redirect
                    }
                } else {
                    console.log("Login failed, showing error modal");  // Debug log
                    showErrorModal();
                }
            } catch (error) {
                console.error('Error during login:', error);
                showErrorModal();
            }
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
        errorTitle.textContent = "Error";
        errorTitle.style = "font-size: 22px; font-weight: bold; margin-bottom: 10px;";

        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Authentication Failed";
        errorMessage.style = "font-size: 16px; color: #555; margin-bottom: 20px;";

        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.style = "padding: 10px 20px; border: none; border-radius: 8px; background: #74b9ff; color: white; font-size: 16px; cursor: pointer; margin-top: 10px;";
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

    const forgotLink = document.getElementById("forgot-password-link");
    const forgotModal = document.getElementById("forgot-password-modal");
    const closeForgotModal = document.getElementById("close-forgot-modal");
    const forgotForm = document.getElementById("forgot-password-form");
    const forgotResponse = document.getElementById("forgot-response-message");

    // Open forgot password modal when link is clicked
    forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        forgotModal.style.display = "flex"; // Show the forgot password modal
    });

    // Close the forgot password modal
    closeForgotModal.addEventListener("click", () => {
        forgotModal.style.display = "none"; // Hide the modal
        forgotForm.reset(); // Reset form fields
        forgotResponse.textContent = ""; // Clear any previous response
    });

    // Handle forgot password form submission
    forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("forgot-email").value;
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (gmailRegex.test(email)) {
            forgotResponse.textContent = `If ${email} is registered, a reset link will be sent.`;
        } else {
            forgotResponse.textContent = `Please enter a valid Gmail address.`;
        }
    });
});
