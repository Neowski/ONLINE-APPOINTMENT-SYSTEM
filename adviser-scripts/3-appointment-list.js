function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


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
            const response = await fetch(`${backendBaseUrl}/api/appointments/`, {
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

            // SR-Code
            const srCodeCell = document.createElement('td');
            srCodeCell.textContent = appointment.sr_code || 'N/A';
            tr.appendChild(srCodeCell);

            // Name (student)
            const nameCell = document.createElement('td');
            nameCell.textContent = appointment.student || 'N/A';
            tr.appendChild(nameCell);

            // Date
            const dateCell = document.createElement('td');
            dateCell.textContent = appointment.date;
            tr.appendChild(dateCell);

            // Time
            const timeCell = document.createElement('td');
            timeCell.textContent = appointment.time;
            tr.appendChild(timeCell);

            // Reason for Consultation
            const reasonCell = document.createElement('td');
            reasonCell.textContent = appointment.reason || 'N/A';
            tr.appendChild(reasonCell);

            // Set data-id attribute for delete
            tr.setAttribute('data-id', appointment.id);

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
        const enteredPassword = document.getElementById('confirmPassword').value;
    
        try {
            const csrfToken = getCookie('csrftoken');
            const response = await fetch(`${backendBaseUrl}/api/validate-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ password: enteredPassword }),
                credentials: 'include',
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || 'Password validation failed');
                return;
            }
    
            // Password validated, proceed with deletion
            closeModal('passwordModal');
    
            if (rowToDelete) {
                const appointmentId = rowToDelete.getAttribute('data-id');
                if (!appointmentId) {
                    alert('Appointment ID not found.');
                    return;
                }
                try {
                    const deleteResponse = await fetch(`${backendBaseUrl}/api/appointments/${appointmentId}/`, {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            'X-CSRFToken': csrfToken,
                        },
                    });
                    if (!deleteResponse.ok) {
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
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to validate password');
        }
    });
    
    

    // Dashboard button
    document.getElementById('dashboard-button').addEventListener('click', () => {
        window.location.href = '2-dashboard.html';
    });

    // Initial fetch
    fetchAppointments();
});
