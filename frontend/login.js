<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('login-error');

    // Make sure Firebase is initialized before using it
    if (typeof firebase === 'undefined' || typeof firebase.auth === 'undefined' || typeof firebase.firestore === 'undefined') {
        errorMessage.textContent = 'Firebase is not initialized. Please check your configuration.';
        return;
    }

    const auth = firebase.auth();
    const db = firebase.firestore();

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = ''; // Clear previous errors

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            // 1. Sign in with Firebase Authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            if (user) {
                // 2. Fetch user document from Firestore to get the role
                const userDocRef = db.collection('users').doc(user.uid);
                const userDoc = await userDocRef.get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const role = userData.role;

                    // 3. Redirect based on role
                    if (role === 'admin') {
                        window.location.href = 'admin.html'; // Redirect to admin page
                    } else if (role === 'superadmin') {
                        window.location.href = 'superadmin.html';
                    }
                    else {
                        window.location.href = 'dashboard.html'; // Redirect to client dashboard
                    }
                } else {
                    // This case should ideally not happen if users are created correctly
                    throw new Error('User data not found in database.');
                }
            }
        } catch (error) {
            // Handle Firebase authentication errors
            console.error('Login Error:', error);
            errorMessage.textContent = error.message;
        }
    });
});
=======
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('https://your-render-backend-url/api/login', { // Replace with your actual Render backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            const data = await response.json();
            errorMessage.textContent = data.message || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'An error occurred during login.';
    }
});
>>>>>>> 0f64b3d6604b52888d25a84ec74eb94ad7f7cff9
