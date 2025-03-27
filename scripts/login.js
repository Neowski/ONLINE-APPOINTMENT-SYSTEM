document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username === "sampleuser" && password === "samplepass") {
                alert("Login successful!");
            } else {
                alert("Invalid credentials. Please try again.");
            }
        });
    } else {
        console.error("#loginForm not found.");
    }
});
