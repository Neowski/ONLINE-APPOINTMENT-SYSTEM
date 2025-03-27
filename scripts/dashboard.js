const calendarBody = document.getElementById("calendar-body");
const currentMonthText = document.getElementById("current-month");
const yearInput = document.getElementById("year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function generateCalendar(month, year) {
    calendarBody.innerHTML = "";
    currentMonthText.textContent = `${months[month]} ${year}`;
    yearInput.value = year;

    const firstDay = new Date(year, month, 1).getDay();  // Get first day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days in month
    const prevMonthDays = new Date(year, month, 0).getDate(); // Days in previous month

    let day = 1;
    let nextMonthDay = 1;
    
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");

            // Fill previous month's days
            if (i === 0 && j < firstDay) {
                cell.textContent = prevMonthDays - firstDay + j + 1;
                cell.classList.add("prev-month");
            }
            // Fill current month days
            else if (day <= daysInMonth) {
                cell.textContent = day++;
                cell.classList.add("current-month");
            }
            // Fill next month's days
            else {
                cell.textContent = nextMonthDay++;
                cell.classList.add("next-month");
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

prevMonthBtn.addEventListener("click", () => changeMonth(-1));
nextMonthBtn.addEventListener("click", () => changeMonth(1));

generateCalendar(currentMonth, currentYear);
