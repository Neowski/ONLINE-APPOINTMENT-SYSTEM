function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Check if this cookie string begins with the name we want
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}



document.addEventListener('DOMContentLoaded', function () {

  let currentUser = {};  // Declare a global-scoped variable for current user

  fetch("http://127.0.0.1:8000/api/current-user/", {
      credentials: "include" // This ensures the session cookie is sent
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch current user");
      return response.json();
    })
    .then(data => {
      currentUser = data; // Store it for later use in appointmentData
      console.log("Current user loaded:", currentUser);
    })
    .catch(error => {
      console.error("Error fetching current user:", error);
    });


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
    const selectedDate = realInput.value;  // "May 2, 2025"
    const selectedTime = selectTime.value;
  
    if (!selectedDate || !selectedTime || selectedTime.includes('Select')) {
      document.getElementById("error-modal").style.display = "block";
      return;
    }
  
    // Log adviserId to see if it's set correctly
    console.log("Adviser ID:", adviserId);
  
    // If adviserId is invalid, show an error
    if (!adviserId) {
      alert("Adviser not selected or invalid. Please select a valid adviser.");
      return;
    }
  
    // Manually format selectedDate to "YYYY-MM-DD"
    const dateObj = new Date(selectedDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;  // Format to YYYY-MM-DD
  
    const appointmentData = {
      adviser: adviserId,  // Use adviserId here
      date: formattedDate,  // Use the formatted date here
      time: selectedTime,
      sr_code: currentUser?.sr_code || "",
      reason: "For Evaluation of POS and Grades"
    };
  
    fetch('http://127.0.0.1:8000/api/appointments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') // Include CSRF token from cookie
      },
      credentials: 'include',
      body: JSON.stringify(appointmentData)
    })
      .then(response => {
        if (response.ok) {
          fp.clear();
          fakeSelect.textContent = '------------Select Date----------';
          selectTime.innerHTML = '<option disabled selected hidden>------------Select Time----------</option>';
          document.getElementById("success-modal").style.display = "block";
        } else {
          return response.text().then(text => {
            try {
              const data = JSON.parse(text);
              throw new Error(data.error || 'Failed to create appointment');
            } catch {
              console.error("Raw response:", text);
              throw new Error('Failed to create appointment (invalid JSON response)');
            }
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
