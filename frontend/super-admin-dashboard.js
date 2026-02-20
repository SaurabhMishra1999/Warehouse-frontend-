document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            // First, get the user's role
            const userDocRef = db.collection('users').doc(user.uid);
            userDocRef.get().then(doc => {
                if (doc.exists && doc.data().role === 'superadmin') {
                    // User is a superadmin, fetch all data
                    fetchSuperAdminData();
                } else {
                    // Redirect if not a superadmin, handled by dashboard-auth.js
                    console.log("User is not a superadmin.");
                }
            });
        } else {
            console.log("User not signed in, waiting for redirect.");
        }
    });
});

function fetchSuperAdminData() {
    // --- 1. Fetch Overview Card Data --- //
    const branchesCard = document.querySelector(".card-info:has(h4:contains('Total Branches'))");
    const revenueCard = document.querySelector(".card-info:has(h4:contains('Total Monthly Revenue'))");
    const clientsCard = document.querySelector(".card-info:has(h4:contains('Total Active Clients'))");

    // Fetch all branches (assuming branches are defined in a separate collection or inferred from users)
    // For this example, we'll infer from the 'users' collection
    db.collection('users').get().then(snapshot => {
        const branches = new Set();
        let totalClients = 0;

        snapshot.forEach(doc => {
            const user = doc.data();
            if (user.branch) {
                branches.add(user.branch);
            }
            if (user.role === 'client') {
                totalClients++;
            }
        });

        if (branchesCard) {
            branchesCard.querySelector('p').textContent = branches.size;
            branchesCard.querySelector('span').textContent = `Across ${[...branches].length} States`; // Placeholder for states
        }

        if (clientsCard) {
            clientsCard.querySelector('p').textContent = `${totalClients}+`;
            clientsCard.querySelector('span').textContent = 'Nationwide';
        }
    });

    // Fetch total revenue (this requires a more complex data model, so we'll mock it for now)
    if (revenueCard) {
        // In a real app, you would aggregate this from a 'transactions' or 'billing' collection
        // For example: db.collectionGroup('transactions').where('status', '==', 'Paid')...
        revenueCard.querySelector('p').textContent = "₹1.5 Cr"; // Mock data
        revenueCard.querySelector('span').textContent = "+5% from last month"; // Mock data
    }


    // --- 2. Fetch Branch Performance Data --- //
    const branchTbody = document.querySelector(".dashboard-section:has(h2:contains('Branch Performance')) table tbody");
    // This is a complex query. A better data model would be a 'branches' collection.
    // We will mock this data for now, as it requires aggregating data per branch.
    if(branchTbody) {
        branchTbody.innerHTML = `
            <tr>
                <td>Mumbai Central</td>
                <td>Maharashtra</td>
                <td>₹25,00,000</td>
                <td><span class="status paid">95%</span></td>
                <td><a href="#" class="btn-small">View Details</a></td>
            </tr>
            <tr>
                <td>Ahmedabad Hub</td>
                <td>Gujarat</td>
                <td>₹18,50,000</td>
                <td><span class="status paid">92%</span></td>
                <td><a href="#" class="btn-small">View Details</a></td>
            </tr>
            <tr>
                <td>Delhi Logistics</td>
                <td>Delhi</td>
                <td>₹15,00,000</td>
                <td><span class="status pending">85%</span></td>
                <td><a href="#" class="btn-small">View Details</a></td>
            </tr>
        `;
    }
}
