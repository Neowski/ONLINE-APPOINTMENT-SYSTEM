let rowToDelete = null;

document.querySelectorAll(".delete-btn").forEach(button => {
  button.addEventListener("click", () => {
    rowToDelete = button.closest("tr");
    openModal("confirmModal");
  });
});

document.getElementById("confirmBtn").addEventListener("click", () => {
  closeModal("confirmModal");
  openModal("passwordModal");
});

document.getElementById("submitPasswordBtn").addEventListener("click", () => {
  // You can check password here if needed.
  closeModal("passwordModal");

  // Simulate deletion
  if (rowToDelete) {
    rowToDelete.remove();
    rowToDelete = null;
  }

  openModal("successModal");
});

function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
