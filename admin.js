document.addEventListener('DOMContentLoaded', async () => {
    // Check user profile first
    try {
        const profileResponse = await fetch('/api/auth/profile');
        if (!profileResponse.ok) {
            // If not authenticated or any other error, redirect to login
            window.location.href = '/login';
            return;
        }

        const profile = await profileResponse.json();
        if (profile.role !== 'admin') {
            // If not an admin, redirect to dashboard or login
            window.location.href = '/dashboard'; // Or '/login'
            return;
        }

        // If admin, proceed to load admin dashboard
        initializeAdminDashboard();

    } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = '/login';
        return;
    }
});


const initializeAdminDashboard = () => {
    const tableBody = document.querySelector('#bookings-table tbody');

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                }
                throw new Error('Failed to fetch bookings');
            }
            
            const data = await response.json();
            const bookings = data.bookings || [];
            renderBookings(bookings.sort((a, b) => b.id - a.id)); // Show newest first
        } catch (error) {
            console.error('Error fetching bookings:', error);
            tableBody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
        }
    };

    const renderBookings = (bookings) => {
        if (bookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            return;
        }

        tableBody.innerHTML = bookings.map(booking => `
            <tr class="status-${booking.status}">
                <td>${booking.id}</td>
                <td>${booking.city}</td>
                <td>${booking.product}</td>
                <td>${booking.sqft}</td>
                <td>${booking.height}</td>
                <td><span class="status">${booking.status}</span></td>
                <td>
                    ${booking.status === 'pending' ? `
                        <button class="btn btn-approve" data-id="${booking.id}">Approve</button>
                        <button class="btn btn-reject" data-id="${booking.id}">Reject</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    };

    const updateBookingStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                }
                throw new Error('Failed to update status');
            }

            await fetchBookings(); // Refresh the table
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error.message);
        }
    };

    tableBody.addEventListener('click', (event) => {
        const target = event.target;
        const id = target.dataset.id;

        if (!id) return; // Ignore clicks on non-button elements

        if (target.classList.contains('btn-approve')) {
            if (confirm('Are you sure you want to approve this booking?')) {
                updateBookingStatus(id, 'approved');
            }
        } else if (target.classList.contains('btn-reject')) {
            if (confirm('Are you sure you want to reject this booking?')) {
                updateBookingStatus(id, 'rejected');
            }
        }
    });

    // Initial fetch
    fetchBookings();
};