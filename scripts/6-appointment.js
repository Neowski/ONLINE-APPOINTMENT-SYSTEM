document.addEventListener('DOMContentLoaded', function () {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthElement = document.getElementById('current-month');
    const calendarBody = document.getElementById('calendar-body');
    
    let currentDate = new Date();
    
    // Format the month and year (e.g., "March 2025")
    function formatDate(month, year) {
        const months = [
            "January", "February", "March", "April", "May", "June", "July", "August", 
            "September", "October", "November", "December"
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
        const nextMonthFirstDay = new Date(currentYear, currentMonth + 1, 1).getDay();

        // Set current month in the header
        currentMonthElement.textContent = formatDate(currentMonth, currentYear);
        
        // Calculate number of days in the current month and determine which day of the week the month starts
        const totalDays = lastDay.getDate();
        const startDay = firstDay.getDay(); // Day of the week the month starts (0 = Sunday, 1 = Monday, etc.)
        
        const daysInPrevMonth = prevMonthLastDay;

        // Clear previous calendar
        calendarBody.innerHTML = '';

        let dayCount = 1;
        
        // Loop to create rows and cells (7 rows = 6 weeks)
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            
            // Loop through each day of the week (7 days per row)
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');

                if (i === 0 && j < startDay) {
                    // Fill in days from the previous month in the first row
                    const prevMonthDay = daysInPrevMonth - startDay + j + 1;
                    cell.textContent = prevMonthDay;
                    cell.classList.add('prev-month'); // Add a class to style the previous month's days
                } else if (dayCount <= totalDays) {
                    // Fill in the days of the current month
                    cell.textContent = dayCount;
                    dayCount++;
                } else {
                    // Fill in days from the next month in the last row
                    const nextMonthDay = dayCount - totalDays;
                    cell.textContent = nextMonthDay;
                    cell.classList.add('next-month'); // Add a class to style the next month's days
                    dayCount++;
                }
                
                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }

    // Initial calendar rendering
    renderCalendar();

    // Event listener for previous month button
    prevMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    // Event listener for next month button
    nextMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});
