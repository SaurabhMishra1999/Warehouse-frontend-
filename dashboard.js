document.addEventListener('DOMContentLoaded', async () => {
    // Check user profile first
    try {
        const profileResponse = await fetch('/api/auth/profile');
        if (!profileResponse.ok) {
            window.location.href = '/login';
            return;
        }

        const profile = await profileResponse.json();
        if (profile.role === 'admin') {
            window.location.href = '/admin';
            return;
        }

        // If client, proceed to load dashboard
        initializeDashboard(profile);

    } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = '/login';
        return;
    }
});


const initializeDashboard = (profile) => {
    const clientNameSpan = document.getElementById('client-name');
    const tableBody = document.querySelector('#client-bookings-table tbody');

    const fetchClientBookings = async () => {
        try {
            const bookingsRes = await fetch('/api/client/bookings');

            if (!bookingsRes.ok) {
                if (bookingsRes.status === 401) {
                    window.location.href = '/login';
                }
                throw new Error('Failed to load bookings.');
            }

            const { bookings } = await bookingsRes.json();
            renderBookings(bookings.sort((a,b) => b.id - a.id));

        } catch (error) {
            console.error('Dashboard Error:', error);
            tableBody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
        }
    };

    const renderBookings = (bookings) => {
        clientNameSpan.textContent = profile.companyName || 'Client';

        if (bookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">You have no recent bookings.</td></tr>';
            return;
        }

        tableBody.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.city}</td>
                <td>${booking.product}</td>
                <td>${booking.sqft}</td>
                <td><span class="status status-${booking.status}">${booking.status}</span></td>
            </tr>
        `).join('');
    };

    fetchClientBookings();
};