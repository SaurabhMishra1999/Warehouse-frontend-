document.addEventListener('DOMContentLoaded', () => {
    const welcomeHeader = document.querySelector('.dashboard-header h1');
    const logoutBtn = document.getElementById('logout-btn');

    // Handle user logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the link from navigating
            auth.signOut().then(() => {
                // Sign-out successful.
                console.log('User logged out successfully');
                window.location.replace('index.html'); // Redirect to home page
            }).catch(error => {
                // An error happened.
                console.error('Logout Error:', error);
            });
        });
    }

    // Listen for authentication state changes
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in. Let's fetch their data.
            const userDocRef = db.collection('users').doc(user.uid);

            userDocRef.get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    const userName = userData.companyName || userData.email; // Use company name, fallback to email
                    const userRole = userData.role;

                    // Update the welcome message on the dashboard
                    if (welcomeHeader) {
                        if (userRole === 'admin') {
                            // For Admins, show their branch if available
                            const branch = userData.branch || 'Admin';
                            welcomeHeader.textContent = `${branch} Dashboard`;
                        } else if (userRole === 'superadmin') {
                            welcomeHeader.textContent = `All India Dashboard`;
                        } else {
                            welcomeHeader.textContent = `Welcome, ${userName}`;
                        }
                    }
                    
                } else {
                    // This case is unlikely if signup process is correct
                    console.error("No user data found in Firestore!");
                    auth.signOut(); // Sign out the user
                }
            }).catch(error => {
                console.error("Error getting user document:", error);
                auth.signOut();
            });

        } else {
            // User is signed out. Redirect to login page.
            console.log("User is not logged in. Redirecting to home page.");
            window.location.replace('index.html');
        }
    });
});
