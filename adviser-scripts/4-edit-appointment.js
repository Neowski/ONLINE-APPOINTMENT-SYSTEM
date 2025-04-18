document.addEventListener('DOMContentLoaded', function () {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthElement = document.getElementById('current-month');
    const calendarBody = document.getElementById('calendar-body');
    const modal = document.getElementById('appointment-modal');
    const modalAppointments = document.getElementById('modal-appointments');
    const modalDateTitle = document.getElementById('modal-date-title');
    const modalBack = document.getElementById('modal-back');
    const appointmentsList = document.getElementById('appointments-list');
    
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationTitle = document.getElementById('confirmation-title');
    const confirmationMessage = document.getElementById('confirmation-message');
    const modalConfirmBtn = document.getElementById('modal-confirm');
    const modalCancelBtn = document.getElementById('modal-cancel');
    
    let currentDate = new Date();
    let selectedDate = null;
    const appointments = {}; // Store appointments by date string
    
    function formatDate(month, year) {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${months[month]} ${year}`;
    }

    function formatFakeDate(date) {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    function renderCalendar() {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

      currentMonthElement.textContent = formatDate(currentMonth, currentYear);

      const totalDays = lastDay.getDate();
      const startDay = firstDay.getDay();

      calendarBody.innerHTML = '';
      let dayCount = 1;

      for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
          const cell = document.createElement('td');

          if (i === 0 && j < startDay) {
            const prevMonthDay = prevMonthLastDay - startDay + j + 1;
            cell.textContent = prevMonthDay;
            cell.classList.add('prev-month');
          } else if (dayCount <= totalDays) {
            cell.textContent = dayCount;
            cell.classList.add('current-month');

            const cellDate = new Date(currentYear, currentMonth, dayCount);

            if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
              cell.classList.add('selected');
            }

            cell.addEventListener('click', function () {
              selectedDate = cellDate;
              fakeSelect.textContent = formatFakeDate(selectedDate); // Update the displayed date
              renderCalendar(); // Re-render to update highlight
              showAppointmentsForDate(
                selectedDate.getFullYear() + '-' +
                String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
                String(selectedDate.getDate()).padStart(2, '0')
              );              
            });

            dayCount++;
          } else {
            const nextMonthDay = dayCount - totalDays;
            cell.textContent = nextMonthDay;
            cell.classList.add('next-month');
            dayCount++;
          }

          row.appendChild(cell);
        }
        calendarBody.appendChild(row);
      }
    }

    function showAppointmentsForDate(dateStr) {
      // Convert the dateStr back into a Date object to avoid timezone shifts
      const selectedDateObj = new Date(dateStr);
      
      // Adjust the date to display in the correct format
      modalDateTitle.textContent = formatFakeDate(selectedDateObj);  // Use adjusted Date object
      modalAppointments.innerHTML = '';

      const list = appointments[dateStr] || [];

      if (list.length === 0) {
        modalAppointments.innerHTML = '<p>No appointments.</p>';
      } else {
        list.forEach((time, index) => {
          const div = document.createElement('div');
          div.classList.add('appointment-item');
          div.innerHTML = `
            <span>${time}</span>
            <div>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          `;

          div.querySelector('.delete-btn').addEventListener('click', () => {
            showConfirmationModal(
              "Delete Appointment",
              "Are you sure you want to delete this appointment?",
              () => {
                list.splice(index, 1);
                showAppointmentsForDate(dateStr);
              }
            );
          });

          div.querySelector('.edit-btn').addEventListener('click', () => {
            // Create an editable input field
            const editInput = document.createElement('input');
            editInput.value = time;
            div.querySelector('span').replaceWith(editInput);

            // Replace Edit button with Save and Cancel buttons
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';

            div.querySelector('.edit-btn').replaceWith(saveButton);
            div.querySelector('.delete-btn').replaceWith(cancelButton);

            saveButton.addEventListener('click', () => {
              const newTime = editInput.value;
              if (newTime) {
                list[index] = newTime;
                showAppointmentsForDate(dateStr);
              }
            });

            cancelButton.addEventListener('click', () => {
              showAppointmentsForDate(dateStr);
            });
          });

          modalAppointments.appendChild(div);
        });
      }

      modal.style.display = 'flex';
    }

    modalBack.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    // Handle date picker with flatpickr
    const realInput = document.getElementById("select-date");
    const fakeSelect = document.getElementById("fake-date-select");

    const fp = flatpickr(realInput, {
      dateFormat: "Y-m-d",
      minDate: "today",
      clickOpens: false, // Disable automatic opening
      onChange: function (selectedDates, dateStr) {
        selectedDate = selectedDates[0];
        fakeSelect.textContent = formatFakeDate(selectedDate);
        renderCalendar(); // Re-render calendar after date change
      }
    });

    fakeSelect.addEventListener("click", () => fp.open()); // Manually open the flatpickr

    // Generate time slots
    function generateTimeSlots(start = "07:00", end = "17:00", interval = 15) {
      const select = document.getElementById("select-time");
      select.innerHTML = '<option disabled selected hidden>------------Select Time------------</option>';

      let [startHour, startMinute] = start.split(':').map(Number);
      let [endHour, endMinute] = end.split(':').map(Number);

      const startTime = new Date();
      startTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);

      while (startTime <= endTime) {
        const timeStr = startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const option = document.createElement('option');
        option.value = timeStr;
        option.textContent = timeStr;
        select.appendChild(option);

        startTime.setMinutes(startTime.getMinutes() + interval);
      }
    }

    generateTimeSlots();

    const addButton = document.getElementById('add');

    addButton.addEventListener('click', () => {
      if (!selectedDate) {
        showConfirmationModal("Error", "Please select a date.", null);
        return;
      }

      const time = document.getElementById('select-time').value;
      if (!time || time.includes("Select Time")) {
        showConfirmationModal("Error", "Please select a time.", null);
        return;
      }

      showConfirmationModal(
        "Add Appointment",
        `Are you sure you want to add an appointment at ${time} on ${formatFakeDate(selectedDate)}?`,
        () => {
            const dateStr = selectedDate.getFullYear() + '-' +
            String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(selectedDate.getDate()).padStart(2, '0');
          if (!appointments[dateStr]) appointments[dateStr] = [];
          appointments[dateStr].push(time);
          showAppointmentsForDate(dateStr);
        }
      );
    });

    // Function to show the confirmation modal
    function showConfirmationModal(title, message, callback) {
      confirmationTitle.textContent = title;
      confirmationMessage.textContent = message;
      confirmationModal.style.display = 'block';

      modalConfirmBtn.onclick = () => {
        if (callback) callback();
        confirmationModal.style.display = 'none';
      };

      modalCancelBtn.onclick = () => {
        confirmationModal.style.display = 'none';
      };
    }

    renderCalendar(); // Initial calendar render

    document.getElementById("returnAppointmentList").addEventListener("click", function () {
      window.location.href = "3-appointment-list.html"; // adjust path if needed
    });
});

document.getElementById('saveChangesBtn').addEventListener('click', function () {
  const srCode = document.getElementById('editSrCode').value;
  const newDate = document.getElementById('editDate').value;
  const newTime = document.getElementById('editTime').value;
  const password = document.getElementById('confirmPassword').value;

  // Optional: Add password check here if needed
  if (!password) {
    alert('Please enter your password to confirm.');
    return;
  }

  fetch('../backend/update_appointment.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ srCode, newDate, newTime })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Appointment updated successfully!');
        document.getElementById('editModal').style.display = 'none';
        fetchAppointments(); // refresh the list
      } else {
        alert('Failed to update appointment');
      }
    });
});
