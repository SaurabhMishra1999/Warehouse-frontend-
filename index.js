document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const logisticsForm = document.getElementById('logistics-form');
    const formMessage = document.getElementById('form-message');

    // Handle Warehouse Booking Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if(formMessage) {
                formMessage.textContent = ''; // Clear previous messages
            }

            const formData = {
                city: bookingForm.city.value,
                product: bookingForm.product.value,
                sqft: bookingForm.sqft.value,
                height: bookingForm.height.value,
            };

            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (!response.ok) {
                    // Display error message from the server
                    throw new Error(data.message || "Couldn't submit booking.");
                }
                if(formMessage) {
                    formMessage.textContent = data.message;
                }
                bookingForm.reset(); // Clear the form

            } catch (error) {
                if(formMessage) {
                    formMessage.textContent = error.message;
                    formMessage.style.color = 'red'; // Indicate an error
                }
            }
        });
    }

    // Handle Logistics Booking Form Submission
    if (logisticsForm) {
        logisticsForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if(formMessage) {
                formMessage.textContent = ''; // Clear previous messages
            }

            const formData = {
                pickupCity: logisticsForm['pickup-city'].value,
                dropoffCity: logisticsForm['dropoff-city'].value,
                vehicleType: logisticsForm['vehicle-type'].value,
                goodsDescription: logisticsForm['goods-description'].value,
            };

            try {
                const response = await fetch('/api/logistics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (!response.ok) {
                    // Display error message from the server
                    throw new Error(data.message || "Couldn't submit logistics request.");
                }
                if(formMessage) {
                    formMessage.textContent = data.message;
                }
                logisticsForm.reset(); // Clear the form

            } catch (error) {
                if(formMessage) {
                    formMessage.textContent = error.message;
                    formMessage.style.color = 'red'; // Indicate an error
                }
            }
        });
    }


    // Login Modal
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-modal-btn');
    const closeBtn = document.querySelector('.modal .close-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
});
