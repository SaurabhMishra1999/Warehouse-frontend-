document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in, let's fetch their dashboard data.
            fetchClientData(user.uid);
        } else {
            // If user is not logged in, dashboard-auth.js will handle the redirect.
            console.log("User not signed in, waiting for redirect.");
        }
    });
});

function fetchClientData(userId) {
    const userDocRef = db.collection('users').doc(userId);

    // --- 1. Fetch Stock Data --- //
    const stockCard = document.querySelector(".card-info:has(h4:contains('Active Stock'))");
    userDocRef.collection('stock').onSnapshot(snapshot => {
        let totalBags = 0;
        let totalValue = 0;

        if (snapshot.empty) {
            if (stockCard) {
                stockCard.querySelector('p').textContent = '0 Bags';
                stockCard.querySelector('span').textContent = 'Total Value: ₹0';
            }
            return;
        }

        snapshot.forEach(doc => {
            const stockItem = doc.data();
            totalBags += parseInt(stockItem.quantity, 10) || 0;
            totalValue += parseFloat(stockItem.value) || 0;
        });

        if (stockCard) {
            stockCard.querySelector('p').textContent = `${totalBags.toLocaleString()} Bags`;
            stockCard.querySelector('span').textContent = `Total Value: ₹${totalValue.toLocaleString()}`;
        }
    }, error => {
        console.error("Error fetching stock data:", error);
    });

    // --- 2. Fetch Transaction Data --- //
    const transactionsTableBody = document.querySelector(".dashboard-section table tbody");
    userDocRef.collection('transactions').orderBy('date', 'desc').limit(5).onSnapshot(snapshot => {
        if (!transactionsTableBody) return;
        transactionsTableBody.innerHTML = ''; // Clear existing static rows

        if (snapshot.empty) {
            transactionsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No transactions found.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const tx = doc.data();
            const date = tx.date.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const amount = `₹${tx.amount.toLocaleString()}`;
            const statusClass = tx.status.toLowerCase(); // e.g., 'paid', 'pending'

            const row = `
                <tr>
                    <td>${date}</td>
                    <td>${tx.invoiceId}</td>
                    <td>${amount}</td>
                    <td><span class="status ${statusClass}">${tx.status}</span></td>
                    <td><a href="#" class="btn-small">View</a></td>
                </tr>
            `;
            transactionsTableBody.innerHTML += row;
        });
    }, error => {
        console.error("Error fetching transaction data:", error);
        if(transactionsTableBody) {
            transactionsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Could not load transactions.</td></tr>';
        }
    });

    // --- 3. Fetch Pending Dues (Billing) ---
    const duesCard = document.querySelector(".card-info:has(h4:contains('Pending Dues'))");
    userDocRef.collection('transactions').where('status', '==', 'Pending').onSnapshot(snapshot => {
        if (!duesCard) return;

        let totalDues = 0;
        let nextDueDate = null;

        if (snapshot.empty) {
            duesCard.querySelector('p').textContent = '₹0';
            duesCard.querySelector('span').textContent = 'No pending dues';
            return;
        }

        snapshot.forEach(doc => {
            const bill = doc.data();
            totalDues += parseFloat(bill.amount) || 0;
            
            if (bill.dueDate && bill.dueDate.toDate) {
                const dueDate = bill.dueDate.toDate();
                if (!nextDueDate || dueDate < nextDueDate) {
                    nextDueDate = dueDate;
                }
            }
        });

        duesCard.querySelector('p').textContent = `₹${totalDues.toLocaleString()}`;
        if (nextDueDate) {
            const formattedDueDate = nextDueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            duesCard.querySelector('span').textContent = `Due by: ${formattedDueDate}`;
        } else {
            duesCard.querySelector('span').textContent = 'Multiple pending payments';
        }

    }, error => {
        console.error("Error fetching pending dues:", error);
        if(duesCard) {
            duesCard.querySelector('p').textContent = 'Error';
            duesCard.querySelector('span').textContent = 'Could not load data';
        }
    });
}
