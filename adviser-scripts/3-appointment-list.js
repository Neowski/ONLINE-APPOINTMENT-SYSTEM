document.addEventListener('DOMContentLoaded', function () {
    const backendBaseUrl = 'http://127.0.0.1:8000'; // Adjust to your backend URL and port

    let isEditing = false;
    let rowToDelete = null;

    const editButton = document.getElementById("edit-button");
    const doneButton = document.getElementById("done-button");
    const indicator = document.getElementById("edit-indicator");
    const tableBody = document.querySelector("tbody");
    const deleteColumnHeader = document.querySelector("thead th:first-child");

    function toggleEditMode(enable) {
        isEditing = enable;
        // Show or hide delete buttons
        document.querySelectorAll(".delete-cell").forEach(cell => {
            cell.style.display = enable ? "table-cell" : "none";
        });
        // Show or hide delete column header
        deleteColumnHeader.style.display = enable ? "table-cell" : "none";
        // Show/hide edit indicators and buttons
        indicator.style.display = enable ? "block" : "none";
        editButton.style.display = enable ? "none" : "inline-block";
        doneButton.style.display = enable ? "inline-block" : "none";
    }

    editButton.addEventListener("click", () => {
        toggleEditMode(true);
    });

    doneButton.addEventListener("click", () => {
        toggleEditMode(false);
    });

    // Fetch appointments from backend API
    async function fetchAppointments() {
        try {
            const response = await fetch(`${backendBaseUrl}/api/adviser-availability/`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const data = await response.json();
            renderAppointments(data);
        } catch (error) {
            console.error(error);
            tableBody.innerHTML = '<tr><td colspan="6">Failed to load appointments.</td></tr>';
        }
    }

    // Render appointments in table
    function renderAppointments(appointments) {
        tableBody.innerHTML = '';
        if (appointments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No appointments found.</td></tr>';
            return;
        }
        appointments.forEach(appointment => {
            const tr = document.createElement('tr');

            // Delete button cell
            const deleteCell = document.createElement('td');
            deleteCell.classList.add('delete-cell');
            deleteCell.style.display = isEditing ? 'table-cell' : 'none';
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '❌';
            deleteBtn.addEventListener('click', () => {
                rowToDelete = tr;
                openModal('confirmModal');
            });
            deleteCell.appendChild(deleteBtn);
            tr.appendChild(deleteCell);

            // SR-Code (assuming appointment has sr_code property, else placeholder)
            const srCodeCell = document.createElement('td');
            srCodeCell.textContent = appointment.sr_code || 'N/A';
            tr.appendChild(srCodeCell);

            // Name (assuming appointment has student_name property, else placeholder)
            const nameCell = document.createElement('td');
            nameCell.textContent = appointment.student_name || 'N/A';
            tr.appendChild(nameCell);

            // Date
            const dateCell = document.createElement('td');
            dateCell.textContent = appointment.date;
            tr.appendChild(dateCell);

            // Time
            const timeCell = document.createElement('td');
            // Format time range if available, else just time
            timeCell.textContent = appointment.time; 
            tr.appendChild(timeCell);

            // Reason for Consultation (assuming appointment has reason property, else placeholder)
            const reasonCell = document.createElement('td');
            reasonCell.textContent = appointment.reason || 'N/A';
            tr.appendChild(reasonCell);

            tableBody.appendChild(tr);
        });
    }

    // Modal handling
    function openModal(id) {
        document.getElementById(id).style.display = 'flex';
    }

    function closeModal(id) {
        document.getElementById(id).style.display = 'none';
    }

    // Confirm delete modal buttons
    document.getElementById('confirmBtn').addEventListener('click', async () => {
        closeModal('confirmModal');
        openModal('passwordModal');
    });

    document.getElementById('submitPasswordBtn').addEventListener('click', async () => {
        // Password validation can be added here if needed
        closeModal('passwordModal');
        if (rowToDelete) {
            // Get appointment id from row data attribute or similar (needs to be set)
            const appointmentId = rowToDelete.getAttribute('data-id');
            if (!appointmentId) {
                alert('Appointment ID not found.');
                return;
            }
            try {
                const response = await fetch(`${backendBaseUrl}/api/adviser-availability/${appointmentId}/`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete appointment');
                }
                rowToDelete.remove();
                rowToDelete = null;
                openModal('successModal');
            } catch (error) {
                console.error(error);
                alert('Failed to delete appointment.');
            }
        }
    });

    // Dashboard button
    document.getElementById('dashboard-button').addEventListener('click', () => {
        window.location.href = '2-dashboard.html';
    });

    // Initial fetch
    fetchAppointments();
});
