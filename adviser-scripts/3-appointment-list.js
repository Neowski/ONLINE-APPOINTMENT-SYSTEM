let isEditing = false;
    let rowToDelete = null;
  
    const editButton = document.getElementById("edit-button");
    const doneButton = document.getElementById("done-button");
    const indicator = document.getElementById("edit-indicator");
    const deleteCells = document.querySelectorAll(".delete-cell");
    const tableCells = document.querySelectorAll("tbody td:not(.delete-cell)");
  
    function toggleEditMode(enable) {
      tableCells.forEach(cell => {
        if (enable) {
          cell.setAttribute("contenteditable", "true");
          cell.style.backgroundColor = "#f9f9f9";
        } else {
          cell.removeAttribute("contenteditable");
          cell.style.backgroundColor = "white";
        }
      });
  
      deleteCells.forEach(cell => {
        cell.style.display = enable ? "table-cell" : "none";
      });
  
      document.querySelector("thead th:first-child").style.display = enable ? "table-cell" : "none";
      indicator.style.display = enable ? "block" : "none";
      editButton.style.display = enable ? "none" : "inline-block";
      doneButton.style.display = enable ? "inline-block" : "none";
    }
  
    editButton.addEventListener("click", () => {
      isEditing = true;
      toggleEditMode(true);
    });
  
    doneButton.addEventListener("click", () => {
      isEditing = false;
      toggleEditMode(false);
      // Removed the alert on save
    });
  
    // ✅ Correct Delete Flow
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
      // You can check the password value here if needed
      const password = document.getElementById("confirmPassword").value;
  
      closeModal("passwordModal");
  
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
  
    // Dashboard button
    document.getElementById("dashboard-button").addEventListener("click", function () {
      window.location.href = "2-dashboard.html";
    });