document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const warehouseHistoryBody = document.getElementById('warehouse-history-body');
    const logisticsHistoryBody = document.getElementById('logistics-history-body');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Logout Functionality ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                console.log('User signed out');
                window.location.href = 'index.html'; // Redirect to home page after logout
            }).catch(error => {
                console.error('Sign out error', error);
            });
        });
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            loadBookingData(user.uid);
        } else {
            // If user is not logged in, show a message
            const loginMessage = '<tr><td colspan="6">Please log in to see your booking history.</td></tr>';
            if (warehouseHistoryBody) warehouseHistoryBody.innerHTML = loginMessage;
            if (logisticsHistoryBody) logisticsHistoryBody.innerHTML = loginMessage;
        }
    });

    function loadBookingData(userId) {
        // --- Fetch Warehouse & Cold Storage Bookings ---
        const warehousePromise = db.collection('warehouseBookings').where('userId', '==', userId).get();
        const coldStoragePromise = db.collection('coldStorageBookings').where('userId', '==', userId).get();

        Promise.all([warehousePromise, coldStoragePromise]).then(([warehouseSnapshot, coldStorageSnapshot]) => {
            let combinedBookings = [];

            warehouseSnapshot.forEach(doc => {
                combinedBookings.push({ serviceType: 'Warehouse', ...doc.data() });
            });

            coldStorageSnapshot.forEach(doc => {
                combinedBookings.push({ serviceType: 'Cold Storage', ...doc.data() });
            });

            // Sort by timestamp, newest first
            combinedBookings.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

            if (warehouseHistoryBody) {
                if (combinedBookings.length === 0) {
                    warehouseHistoryBody.innerHTML = '<tr><td colspan="6">No warehouse or cold storage bookings found.</td></tr>';
                } else {
                    let html = '';
                    combinedBookings.forEach(booking => {
                        html += `
                            <tr>
                                <td>${booking.serviceType}</td>
                                <td>${escapeHtml(booking.city)}</td>
                                <td>${escapeHtml(booking.productDescription)}</td>
                                <td>${escapeHtml(booking.requiredSpace)}</td>
                                <td><span class="status status-${escapeHtml(booking.status)}">${escapeHtml(booking.status)}</span></td>
                                <td>${formatDate(booking.timestamp)}</td>
                            </tr>
                        `;
                    });
                    warehouseHistoryBody.innerHTML = html;
                }
            }
        }).catch(error => {
            console.error("Error fetching general bookings: ", error);
            if (warehouseHistoryBody) warehouseHistoryBody.innerHTML = '<tr><td colspan="6">Error loading bookings.</td></tr>';
        });

        // --- Fetch Logistics Bookings ---
        db.collection('logisticsBookings').where('userId', '==', userId)
            .orderBy('timestamp', 'desc').get()
            .then(snapshot => {
                if (logisticsHistoryBody) {
                    if (snapshot.empty) {
                        logisticsHistoryBody.innerHTML = '<tr><td colspan="6">No logistics bookings found.</td></tr>';
                        return;
                    }
                    let html = '';
                    snapshot.forEach(doc => {
                        const booking = doc.data();
                        html += `
                            <tr>
                                <td>${escapeHtml(booking.pickupCity)}</td>
                                <td>${escapeHtml(booking.dropoffCity)}</td>
                                <td>${escapeHtml(booking.vehicleType)}</td>
                                <td>${escapeHtml(booking.goodsDescription)}</td>
                                <td><span class="status status-${escapeHtml(booking.status)}">${escapeHtml(booking.status)}</span></td>
                                <td>${formatDate(booking.timestamp)}</td>
                            </tr>
                        `;
                    });
                    logisticsHistoryBody.innerHTML = html;
                }
            }).catch(error => {
                 console.error("Error fetching logistics bookings: ", error);
                 if (logisticsHistoryBody) logisticsHistoryBody.innerHTML = '<tr><td colspan="6">Error loading bookings.</td></tr>';
            });
    }

    // --- Helper functions ---
    function formatDate(timestamp) {
        if (!timestamp || !timestamp.toDate) return 'N/A';
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-IN'); // Format as DD/MM/YYYY
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>"'/]/g, function (s) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            }[s];
        });
    }
});
