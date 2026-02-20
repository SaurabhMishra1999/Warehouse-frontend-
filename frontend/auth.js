document.addEventListener('DOMContentLoaded', () => {
    // --- Common Elements & Functions ---
    const notification = document.getElementById('notification');
    const signupForm = document.getElementById('signup-form');
    const userLoginForm = document.getElementById('user-login-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const superadminLoginForm = document.getElementById('superadmin-login-form');

    // Function to display notifications
    const showAuthNotification = (message, type) => {
        // Try to use the dedicated notification div on the signup page
        if (notification) {
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        } else {
            // Fallback to a simple alert on other pages (like index.html)
            alert(message);
        }
    };

    // --- Signup Logic (for signup.html) ---
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const companyName = signupForm['company-name'].value;
            const email = signupForm['email'].value;
            const password = signupForm['password'].value;
            const phone = signupForm['phone'].value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    // Save additional user data to Firestore
                    db.collection('users').doc(user.uid).set({
                        companyName: companyName,
                        email: email,
                        phone: phone,
                        role: 'client', // New users are clients by default
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        showAuthNotification('Registration successful! Redirecting to your dashboard...', 'success');
                        setTimeout(() => {
                            window.location.href = 'client-dashboard.html';
                        }, 2000);
                    })
                    .catch((error) => showAuthNotification(`Error saving user data: ${error.message}`, 'error'));
                })
                .catch((error) => showAuthNotification(`Signup failed: ${error.message}`, 'error'));
        });
    }

    // --- Login Logic (for index.html modal) ---
    const handleLogin = (form, usernameField, passwordField, expectedRole) => {
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form[usernameField].value;
                const password = form[passwordField].value;

                if (!email || !password) {
                    showAuthNotification('Please enter both email and password.', 'error');
                    return;
                }

                auth.signInWithEmailAndPassword(email, password)
                    .then(userCredential => {
                        const user = userCredential.user;
                        const userDocRef = db.collection('users').doc(user.uid);

                        userDocRef.get().then((doc) => {
                            if (doc.exists) {
                                const userRole = doc.data().role;

                                // Verify if the user is logging in from the correct tab
                                if (userRole !== expectedRole) {
                                    showAuthNotification(`You are a ${userRole}. Please use the '${userRole}' login tab.`, 'error');
                                    auth.signOut(); // Log out the incorrectly logged-in user
                                    return;
                                }

                                // Redirect to the correct dashboard
                                switch(userRole) {
                                    case 'client':
                                        window.location.href = 'client-dashboard.html';
                                        break;
                                    case 'admin':
                                        window.location.href = 'admin-dashboard.html';
                                        break;
                                    case 'superadmin':
                                        window.location.href = 'super-admin-dashboard.html';
                                        break;
                                    default:
                                        showAuthNotification('Error: Unknown user role.', 'error');
                                        auth.signOut();
                                }
                            } else {
                                showAuthNotification('Error: User data not found.', 'error');
                                auth.signOut();
                            }
                        }).catch(error => {
                            showAuthNotification(`Error fetching user data: ${error.message}`, 'error');
                            auth.signOut();
                        });
                    })
                    .catch(error => {
                        showAuthNotification(`Login Failed: ${error.message}`, 'error');
                    });
            });
        }
    };
    
    // Attach login handlers to each form
    handleLogin(userLoginForm, 'user-username', 'user-password', 'client');
    handleLogin(adminLoginForm, 'admin-username', 'admin-password', 'admin');
    handleLogin(superadminLoginForm, 'superadmin-username', 'superadmin-password', 'superadmin');
});
