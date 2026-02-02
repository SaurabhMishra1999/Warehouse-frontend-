document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = ''; // Clear previous errors

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            // 1. Authenticate the user
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                throw new Error(loginData.message || 'Login failed');
            }

            // 2. Fetch user profile to determine role
            const profileResponse = await fetch('/api/auth/profile');
            if (!profileResponse.ok) {
                throw new Error('Could not fetch user profile.');
            }
            
            const profile = await profileResponse.json();

            // 3. Redirect based on role
            if (profile.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/dashboard';
            }

        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
});