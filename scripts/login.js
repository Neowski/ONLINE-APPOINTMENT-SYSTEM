document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    function showErrorModal() {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0, 0, 0, 0.4)"; // Slightly transparent dark background
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "1000";

        // Create modal box
        const modal = document.createElement("div");
        modal.style.background = "#f9f9f9"; // Lighter modal background
        modal.style.padding = "30px";
        modal.style.borderRadius = "12px";
        modal.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)"; // Softer shadow
        modal.style.textAlign = "center";
        modal.style.width = "400px";
        modal.style.position = "relative";

        // Create error icon (red circle with X)
        const errorIcon = document.createElement("div");
        errorIcon.innerHTML = "&#10006;"; // Unicode for X
        errorIcon.style.fontSize = "50px";
        errorIcon.style.color = "#ff7675"; // Lighter red
        errorIcon.style.border = "3px solid #ff7675"; // Match border color
        errorIcon.style.borderRadius = "50%";
        errorIcon.style.width = "80px";
        errorIcon.style.height = "80px";
        errorIcon.style.display = "flex";
        errorIcon.style.alignItems = "center";
        errorIcon.style.justifyContent = "center";
        errorIcon.style.margin = "0 auto 15px auto";

        // Error text
        const errorTitle = document.createElement("p");
        errorTitle.textContent = "Error";
        errorTitle.style.fontSize = "22px";
        errorTitle.style.fontWeight = "bold";
        errorTitle.style.marginBottom = "10px";

        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Authentication Failed";
        errorMessage.style.fontSize = "16px";
        errorMessage.style.color = "#555";
        errorMessage.style.marginBottom = "20px";

        // OK button
        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.style.padding = "10px 20px";
        okButton.style.border = "none";
        okButton.style.borderRadius = "8px";
        okButton.style.background = "#74b9ff"; // Light blue button
        okButton.style.color = "white";
        okButton.style.fontSize = "16px";
        okButton.style.cursor = "pointer";
        okButton.style.marginTop = "10px";
        okButton.onclick = function () {
            document.body.removeChild(overlay);
        };

        // Append elements
        modal.appendChild(errorIcon);
        modal.appendChild(errorTitle);
        modal.appendChild(errorMessage);
        modal.appendChild(okButton);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username === "sampleuser" && password === "samplepass") {
                window.location.href = "../pages/welcome.html";
            } else {
                showErrorModal();
            }
        });
    } else {
        console.error("#loginForm not found.");
    }
});
