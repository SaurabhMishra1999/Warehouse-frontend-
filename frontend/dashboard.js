document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Main dashboard elements
    const companyNameEl = document.getElementById('company-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Tab elements
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Booking form container
    const bookingFormContainer = document.getElementById('booking-form-container');

    // Recent bookings table bodies
    const recentWarehouseBody = document.getElementById('recent-warehouse-body');
    const recentLogisticsBody = document.getElementById('recent-logistics-body');

    // Branch management elements
    const addBranchForm = document.getElementById('add-branch-form');
    const branchesContainer = document.getElementById('branches-container');
    const branchNameInput = document.getElementById('branch-name-input');
    const branchLocationInput = document.getElementById('branch-location-input');

    let currentUser = null;
    let companyId = null; // Assuming one user belongs to one company

    // --- Main Authentication Flow ---
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                companyId = userData.companyId;
                companyNameEl.textContent = userData.companyName || 'User';
                initializeDashboard();
            } else {
                console.error('User data not found!');
                auth.signOut();
            }
        } else {
            window.location.href = 'index.html';
        }
    });

    function initializeDashboard() {
        setupTabs();
        setupLogout();
        loadRecentBookings();
        loadBookingForm(); 
        initializeBranchManagement();
    }

    // --- Tab Switching Logic ---
    function setupTabs() {
        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.getAttribute('data-tab');

                tabLinks.forEach(item => item.classList.remove('active'));
                tabContents.forEach(item => item.classList.remove('active'));

                link.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // --- Logout --- 
    function setupLogout() {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                window.location.href = 'index.html';
            });
        });
    }

    // --- Load Recent Bookings ---
    function loadRecentBookings() {
        if (!currentUser) return;

        // Warehouse & Cold Storage
        const warehousePromise = db.collection('warehouseBookings').where('userId', '==', currentUser.uid).orderBy('timestamp', 'desc').limit(5).get();
        const coldStoragePromise = db.collection('coldStorageBookings').where('userId', '==', currentUser.uid).orderBy('timestamp', 'desc').limit(5).get();

        Promise.all([warehousePromise, coldStoragePromise]).then(([warehouseSnapshot, coldStorageSnapshot]) => {
            let combined = [];
            warehouseSnapshot.forEach(doc => combined.push({type: 'Warehouse', ...doc.data()}));
            coldStorageSnapshot.forEach(doc => combined.push({type: 'Cold Storage', ...doc.data()}));
            combined.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
            
            recentWarehouseBody.innerHTML = combined.slice(0, 5).map(b => `
                <tr>
                    <td>${b.type}</td>
                    <td>${b.city}</td>
                    <td>${b.productDescription}</td>
                    <td>${b.requiredSpace}</td>
                    <td><span class="status status-${b.status}">${b.status}</span></td>
                </tr>
            `).join('') || '<tr><td colspan="5">No recent bookings.</td></tr>';
        });

        // Logistics
        db.collection('logisticsBookings').where('userId', '==', currentUser.uid).orderBy('timestamp', 'desc').limit(5).get().then(snapshot => {
            recentLogisticsBody.innerHTML = snapshot.docs.map(doc => {
                const b = doc.data();
                return `
                    <tr>
                        <td>${b.pickupCity}</td>
                        <td>${b.dropoffCity}</td>
                        <td>${b.vehicleType}</td>
                        <td><span class="status status-${b.status}">${b.status}</span></td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="4">No recent bookings.</td></tr>';
        });
    }

    // --- Load and Initialize Booking Form ---
    async function loadBookingForm() {
        try {
            const response = await fetch('index.html');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const bookingSection = doc.querySelector('#booking');

            if (bookingSection) {
                bookingFormContainer.innerHTML = bookingSection.innerHTML;
                // Now that the HTML is loaded, initialize its specific JS
                initializeDynamicFormLogic();
            } else {
                bookingFormContainer.innerHTML = '<p>Error loading booking form.</p>';
            }
        } catch (error) {
            console.error('Failed to load booking form:', error);
            bookingFormContainer.innerHTML = '<p>Error loading booking form.</p>';
        }
    }
    
    // --- Re-initialize JS for the loaded form ---
    function initializeDynamicFormLogic() {
        const form = bookingFormContainer.querySelector('#booking-form');
        if (!form) return;
        
        const formTabs = form.querySelector('.form-tabs');
        const formContents = form.querySelectorAll('.form-content');
        const citySelects = form.querySelectorAll('select[name="city"]');
        const pickupCitySelect = form.querySelector('select[name="pickup-city"]');
        const dropoffCitySelect = form.querySelector('select[name="dropoff-city"]');
        
        const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"];
        const populateSelect = (select) => {
            if (!select) return;
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                select.appendChild(option);
            });
        };
        
        citySelects.forEach(populateSelect);
        populateSelect(pickupCitySelect);
        populateSelect(dropoffCitySelect);

        formTabs.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const tab = e.target.dataset.tab;
                form.querySelector('.form-tabs .active').classList.remove('active');
                e.target.classList.add('active');

                formContents.forEach(content => {
                    content.style.display = 'none';
                });
                form.querySelector(`#${tab}`).style.display = 'block';
            }
        });

        form.addEventListener('submit', handleBookingSubmit);
    }

    // --- Unified Booking Submission Logic ---
    async function handleBookingSubmit(e) {
        e.preventDefault();
        if (!currentUser) {
            alert('You must be logged in to book.');
            return;
        }

        const activeTab = bookingFormContainer.querySelector('.form-tabs .active').dataset.tab;
        const btn = e.submitter;
        btn.disabled = true;
        btn.textContent = 'Submitting...';

        try {
            let bookingData = {
                userId: currentUser.uid,
                companyId: companyId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending' // Default status
            };
            let collectionName = '';

            if (activeTab === 'warehouse' || activeTab === 'cold-storage') {
                collectionName = activeTab === 'warehouse' ? 'warehouseBookings' : 'coldStorageBookings';
                Object.assign(bookingData, {
                    city: document.querySelector(`#${activeTab} select[name='city']`).value,
                    productDescription: document.querySelector(`#${activeTab} input[name='product']`).value,
                    requiredSpace: document.querySelector(`#${activeTab} input[name='space']`).value
                });
            } else if (activeTab === 'logistics') {
                collectionName = 'logisticsBookings';
                Object.assign(bookingData, {
                    pickupCity: document.querySelector('#logistics select[name="pickup-city"]').value,
                    dropoffCity: document.querySelector('#logistics select[name="dropoff-city"]').value,
                    goodsDescription: document.querySelector('#logistics input[name="goods-description"]').value,
                    vehicleType: document.querySelector('#logistics select[name="vehicle-type"]').value
                });
            }
            
            await db.collection(collectionName).add(bookingData);
            alert('Booking submitted successfully!');
            loadRecentBookings(); // Refresh recent bookings
            e.target.reset();
        } catch (error) {
            console.error('Booking failed:', error);
            alert('An error occurred. Please try again.');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Submit Request';
        }
    }
    
    // --- Branch Management Logic ---
    function initializeBranchManagement() {
        addBranchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = branchNameInput.value.trim();
            const location = branchLocationInput.value.trim();

            if (name && location && companyId) {
                try {
                    await db.collection('companies').doc(companyId).collection('branches').add({ name, location });
                    addBranchForm.reset();
                    renderBranches();
                    alert('Branch added!');
                } catch (error) {
                    console.error('Error adding branch:', error);
                }
            }
        });
        renderBranches();
    }

    async function renderBranches() {
        if (!companyId) return;
        const snapshot = await db.collection('companies').doc(companyId).collection('branches').get();
        if (snapshot.empty) {
            branchesContainer.innerHTML = '<p>No branches added yet.</p>';
            return;
        }
        branchesContainer.innerHTML = snapshot.docs.map(doc => `
            <div class="branch-item">${doc.data().name} - ${doc.data().location}</div>
        `).join('');
    }
});
