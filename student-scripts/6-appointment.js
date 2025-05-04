document.addEventListener('DOMContentLoaded', function () {
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const currentMonthElement = document.getElementById('current-month');
  const calendarBody = document.getElementById('calendar-body');
  const realInput = document.getElementById("select-date");
  const fakeSelect = document.getElementById("fake-date-select");
  const selectTime = document.getElementById("select-time");
  const submitBtn = document.getElementById("submit");

  let currentDate = new Date();

  // Function to format the current date for calendar display
  function formatDate(month, year) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${months[month]} ${year}`;
  }

  // Function to render the calendar
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

  // Event listeners for the previous and next buttons
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();

  // Flatpickr initialization
  const fp = flatpickr(realInput, {
    dateFormat: "F j, Y",
    minDate: "today",
    clickOpens: false,
    appendTo: fakeSelect,
    position: "below",
    onChange: function (selectedDates, dateStr) {
      fakeSelect.textContent = dateStr;
    },
    onReady: function (_, __, instance) {
      instance.calendarContainer.style.marginTop = "5px";
    }
  });

  // Fake date select click event to open the Flatpickr calendar
  fakeSelect.addEventListener("click", () => fp.open());

  // Generate available time slots
  function generateTimeSlots(start = "07:00", end = "17:00", interval = 15) {
    selectTime.innerHTML = '<option>------------Select Time------------</option>';

    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (startTime <= endTime) {
      const timeStr = startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const option = document.createElement("option");
      option.value = timeStr;
      option.textContent = timeStr;
      selectTime.appendChild(option);

      startTime.setMinutes(startTime.getMinutes() + interval);
    }
  }

  generateTimeSlots();

  // Submit Button Logic
  submitBtn.addEventListener('click', () => {
    const selectedDate = realInput.value;
    const selectedTime = selectTime.value;

    if (!selectedDate || !selectedTime || selectedTime.includes('Select')) {
      // Show error modal if date or time is not selected
      document.getElementById("error-modal").style.display = "block";
      return;
    }

    console.log('Appointment Date:', selectedDate);
    console.log('Appointment Time:', selectedTime);

    // Clear fields after submit
    fp.clear();
    fakeSelect.textContent = '------------Select Date----------';
    selectTime.selectedIndex = 0;

    // Show success modal
    document.getElementById("success-modal").style.display = "block";
  });

  // Error modal "OK" button
  document.getElementById("close-error-modal").addEventListener("click", () => {
    document.getElementById("error-modal").style.display = "none";
  });

  // Success modal "OK" button
  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("success-modal").style.display = "none";
    location.reload(); // Optional: reload the page after closing the modal
  });
});
