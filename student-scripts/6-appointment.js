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
  let adviserId = localStorage.getItem('selectedAdviserId');
  let availabilities = [];
  let availableDates = new Set();

  function formatDate(month, year) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${months[month]} ${year}`;
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
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
          cell.textContent = dayCount;
          if (availableDates.has(dateStr)) {
            cell.classList.add('available-date');
            cell.style.cursor = 'pointer';
            cell.addEventListener('click', () => {
              fp.setDate(new Date(dateStr), true); // Pass Date object instead of string
            });
          } else {
            cell.classList.add('unavailable-date');
            cell.style.color = '#ccc';
          }
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

  function fetchAvailabilities() {
    if (!adviserId) {
      alert('No adviser selected. Please select an adviser first.');
      return;
    }
    fetch('http://127.0.0.1:8000/api/adviser-availability/')
      .then(response => response.json())
      .then(data => {
        availabilities = data.filter(a => {
          if (typeof a.adviser === 'object' && a.adviser !== null) {
            return a.adviser.id == adviserId;
          } else {
            return a.adviser == adviserId;
          }
        });
        availableDates = new Set(availabilities.map(a => a.date));
        renderCalendar();
      })
      .catch(error => {
        console.error('Error fetching availabilities:', error);
      });
  }

  function updateTimeSlots(selectedDate) {
    // Convert selectedDate from "F j, Y" to "YYYY-MM-DD"
    const dateObj = new Date(selectedDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    selectTime.innerHTML = '<option disabled selected hidden>------------Select Time----------</option>';
    const timesForDate = availabilities
      .filter(a => a.date === formattedDate)
      .map(a => a.time);
    timesForDate.forEach(time => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      selectTime.appendChild(option);
    });
  }

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  fetchAvailabilities();

  const fp = flatpickr(realInput, {
    dateFormat: "F j, Y",
    minDate: "today",
    clickOpens: true,
    appendTo: fakeSelect,
    position: "below",
    onChange: function (selectedDates, dateStr) {
      fakeSelect.textContent = dateStr;
      updateTimeSlots(dateStr);
    },
    onReady: function (_, __, instance) {
      instance.calendarContainer.style.marginTop = "5px";
    }
  });

  fakeSelect.addEventListener("click", () => fp.open());

  submitBtn.addEventListener('click', () => {
    const selectedDate = realInput.value;
    const selectedTime = selectTime.value;

    if (!selectedDate || !selectedTime || selectedTime.includes('Select')) {
      document.getElementById("error-modal").style.display = "block";
      return;
    }

    const appointmentData = {
      adviser: adviserId,
      date: selectedDate,
      time: selectedTime,
      sr_code: "",
      reason: ""
    };

    fetch('http://127.0.0.1:8000/api/appointments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    })
      .then(response => {
        if (response.ok) {
          fp.clear();
          fakeSelect.textContent = '------------Select Date----------';
          selectTime.innerHTML = '<option disabled selected hidden>------------Select Time----------</option>';
          document.getElementById("success-modal").style.display = "block";
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Failed to create appointment');
          });
        }
      })
      .catch(error => {
        console.error('Error creating appointment:', error);
        alert('Error creating appointment: ' + error.message);
      });
  });

  document.getElementById("close-error-modal").addEventListener("click", () => {
    document.getElementById("error-modal").style.display = "none";
  });

  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("success-modal").style.display = "none";
    location.reload();
  });
});
