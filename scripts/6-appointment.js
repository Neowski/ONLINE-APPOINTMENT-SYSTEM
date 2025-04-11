document.addEventListener('DOMContentLoaded', function () {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthElement = document.getElementById('current-month');
    const calendarBody = document.getElementById('calendar-body');
    let currentDate = new Date();
  
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
  
    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  
    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  
    renderCalendar();
  
    // Fake-select dropdown logic
    const realInput = document.getElementById("select-date");
    const fakeSelect = document.getElementById("fake-date-select");
  
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
  
    fakeSelect.addEventListener("click", () => fp.open());
  
    // Time slots
    function generateTimeSlots(start = "07:00", end = "17:00", interval = 15) {
      const select = document.getElementById("select-time");
      select.innerHTML = '<option>------------Select Time------------</option>';
  
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
        select.appendChild(option);
  
        startTime.setMinutes(startTime.getMinutes() + interval);
      }
    }
  
    generateTimeSlots();
  });
  