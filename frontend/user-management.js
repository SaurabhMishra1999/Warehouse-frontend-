
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const userListTbody = document.getElementById('user-list-tbody');
    const roleFilter = document.getElementById('roleFilter');

    let allUsers = []; // Cache for all users

    // Check for superadmin role
    auth.onAuthStateChanged(user => {
        if (user) {
            const userDocRef = db.collection('users').doc(user.uid);
            userDocRef.get().then(doc => {
                if (doc.exists && doc.data().role === 'superadmin') {
                    fetchAllUsers();
                    setupEventListeners();
                } else {
                    document.body.innerHTML = '<h1>Access Denied</h1>';
                }
            });
        } else {
            console.log("User not signed in.");
        }
    });

    function setupEventListeners() {
        // Filter users when the role selection changes
        roleFilter.addEventListener('change', () => {
            renderUsers(roleFilter.value);
        });

        // Handle user actions (Edit/Delete)
        userListTbody.addEventListener('click', (e) => {
            const target = e.target;
            const userId = target.dataset.id;

            if (!userId) return;

            if (target.classList.contains('btn-danger')) {
                // Delete User
                if (confirm('Are you sure you want to delete this user record from Firestore? This does not delete their authentication entry.')) {
                    db.collection('users').doc(userId).delete()
                        .then(() => console.log(`User ${userId} deleted.`))
                        .catch(error => console.error('Error deleting user:', error));
                }
            } else if (target.classList.contains('btn-edit-role')) {
                // Edit User Role
                const newRole = prompt('Enter new role (client, admin, superadmin):');
                if (newRole && ['client', 'admin', 'superadmin'].includes(newRole)) {
                    db.collection('users').doc(userId).update({ role: newRole })
                        .then(() => console.log(`User ${userId} role updated to ${newRole}.`))
                        .catch(error => console.error('Error updating role:', error));
                }
                 else if (newRole) {
                    alert('Invalid role. Please use client, admin, or superadmin.');
                }
            }
        });
    }

    // Fetch all users from Firestore and subscribe to changes
    function fetchAllUsers() {
        db.collection('users').onSnapshot(snapshot => {
            allUsers = [];
            snapshot.forEach(doc => {
                allUsers.push({ id: doc.id, ...doc.data() });
            });
            renderUsers(roleFilter.value); // Render with the current filter
        }, error => {
            console.error("Error fetching users:", error);
            userListTbody.innerHTML = '<tr><td colspan="6">Error loading users.</td></tr>';
        });
    }

    // Render users in the table based on the selected filter
    function renderUsers(role = 'all') {
        userListTbody.innerHTML = '';
        const filteredUsers = allUsers.filter(user => role === 'all' || user.role === role);

        if (filteredUsers.length === 0) {
            userListTbody.innerHTML = '<tr><td colspan="6">No users found for this filter.</td></tr>';
            return;
        }

        filteredUsers.forEach(user => {
            const userStatus = user.status || 'active'; // Default to active
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.role || 'N/A'}</td>
                    <td>${user.branch || 'N/A'}</td>
                    <td><span class="status ${userStatus}">${userStatus}</span></td>
                    <td>
                        <button class="btn-small btn-edit-role" data-id="${user.id}">Edit Role</button>
                        <button class="btn-small btn-danger" data-id="${user.id}">Delete</button>
                    </td>
                </tr>
            `;
            userListTbody.innerHTML += row;
        });
    }
});
