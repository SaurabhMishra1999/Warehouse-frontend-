
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const addBranchForm = document.getElementById('add-branch-form');
    const branchListTbody = document.getElementById('branch-list-tbody');

    // Check for superadmin role before doing anything
    auth.onAuthStateChanged(user => {
        if (user) {
            const userDocRef = db.collection('users').doc(user.uid);
            userDocRef.get().then(doc => {
                if (doc.exists && doc.data().role === 'superadmin') {
                    loadBranches();
                    setupEventListeners();
                } else {
                    console.error("Access Denied. User is not a superadmin.");
                    // Optionally, redirect them or show an error message on the page
                    document.body.innerHTML = '<h1>Access Denied</h1>';
                }
            });
        } else {
            // Handled by dashboard-auth.js, but as a fallback
            console.log("User not signed in.");
        }
    });

    function setupEventListeners() {
        // Handle Add Branch Form Submission
        addBranchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const branchName = document.getElementById('branchName').value;
            const branchState = document.getElementById('branchState').value;
            const branchCity = document.getElementById('branchCity').value;
            const branchManager = document.getElementById('branchManager').value;

            // Simple validation
            if (!branchName || !branchState || !branchCity) {
                alert('Please fill out all required fields.');
                return;
            }

            // Add to Firestore 'branches' collection
            db.collection('branches').add({
                name: branchName,
                state: branchState,
                city: branchCity,
                managerId: branchManager, // We should validate this ID exists and is an admin
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                console.log('Branch added successfully!');
                addBranchForm.reset();
                // The onSnapshot listener will auto-refresh the list
            }).catch(error => {
                console.error("Error adding branch: ", error);
                alert('Failed to add branch. See console for details.');
            });
        });

        // Handle Delete Button Clicks (using event delegation)
        branchListTbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-danger')) {
                const branchId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
                    db.collection('branches').doc(branchId).delete()
                        .then(() => console.log('Branch deleted successfully!'))
                        .catch(error => console.error('Error deleting branch:', error));
                }
            }
        });
    }

    // Function to load and display branches
    function loadBranches() {
        db.collection('branches').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            branchListTbody.innerHTML = ''; // Clear the table
            if (snapshot.empty) {
                branchListTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No branches found. Add one above!</td></tr>';
                return;
            }

            snapshot.forEach(doc => {
                const branch = doc.data();
                const row = `
                    <tr>
                        <td>${branch.name}</td>
                        <td>${branch.state}</td>
                        <td>${branch.city}</td>
                        <td><span class="status active">${branch.managerId || 'Not Assigned'}</span></td>
                        <td>
                            <a href="#" class="btn-small btn-danger" data-id="${doc.id}">Delete</a>
                        </td>
                    </tr>
                `;
                branchListTbody.innerHTML += row;
            });
        }, error => {
            console.error("Error loading branches:", error);
            branchListTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Error loading branches.</td></tr>';
        });
    }
});
