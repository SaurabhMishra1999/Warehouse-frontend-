document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display damage reports
    fetch('https://your-render-backend-url/api/damagereports') // Replace with your actual Render backend URL
        .then(response => response.json())
        .then(damageReports => {
            const tableBody = document.getElementById('damage-reports-body');
            tableBody.innerHTML = ''; // Clear static data
            damageReports.forEach(report => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${report.reportId}</td>
                    <td>${report.vehicleNo}</td>
                    <td>${report.date}</td>
                    <td>${report.status}</td>
                    <td><button>View</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching damage reports:', error));

    // Fetch and display payment information
    fetch('https://your-render-backend-url/api/payments') // Replace with your actual Render backend URL
        .then(response => response.json())
        .then(payments => {
            document.getElementById('pending-payment-amount').textContent = `₹${payments.pendingAmount.toLocaleString()}`;
            document.getElementById('remaining-stock-value').textContent = `₹${payments.remainingStockValue.toLocaleString()}`;
        })
        .catch(error => console.error('Error fetching payment data:', error));
});