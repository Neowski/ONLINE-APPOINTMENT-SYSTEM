let isEditing = false;
    let rowToDelete = null;
  
    const editButton = document.getElementById("edit-button");
    const doneButton = document.getElementById("done-button");
    const indicator = document.getElementById("edit-indicator");
    const deleteCells = document.querySelectorAll(".delete-cell");
    const tableCells = document.querySelectorAll("tbody td:not(.delete-cell)");
  
    function toggleEditMode(enable) {
      // ✅ Make sure all cells are NOT editable
      tableCells.forEach(cell => {
        cell.removeAttribute("contenteditable");
        cell.style.backgroundColor = "white"; // or keep your theme
      });
    
      // ✅ Show or hide delete buttons only
      deleteCells.forEach(cell => {
        cell.style.display = enable ? "table-cell" : "none";
      });
    
      // ✅ Also toggle the header for delete column
      document.querySelector("thead th:first-child").style.display = enable ? "table-cell" : "none";
    
      // ✅ Show/hide edit indicators and buttons
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

    function fetchAppointments() {
      fetch('../backend/get_appointments.php')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const listContainer = document.getElementById('appointmentList');
            listContainer.innerHTML = '';
    
            data.appointments.forEach(appointment => {
              const item = document.createElement('div');
              item.className = 'appointment-item';
              item.innerHTML = `
                <p><strong>${appointment.name}</strong> (${appointment.sr_code})</p>
                <p>Date: ${appointment.appointment_date} | Time: ${appointment.appointment_time}</p>
                <button class="edit-btn" data-sr-code="${appointment.sr_code}" data-date="${appointment.appointment_date}" data-time="${appointment.appointment_time}">Edit</button>
              `;
              listContainer.appendChild(item);
            });
    
            attachEditListeners();
          }
        });
    }
    
    function attachEditListeners() {
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
          const srCode = this.getAttribute('data-sr-code');
          const date = this.getAttribute('data-date');
          const time = this.getAttribute('data-time');
    
          document.getElementById('editSrCode').value = srCode;
          document.getElementById('editDate').value = date;
          document.getElementById('editTime').value = time;
          document.getElementById('editModal').style.display = 'block';
        });
      });
    }
    
    document.addEventListener('DOMContentLoaded', fetchAppointments);
    