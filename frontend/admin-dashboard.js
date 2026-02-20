document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            // First, get the admin's role and branch from the 'users' collection
            const userDocRef = db.collection('users').doc(user.uid);
            userDocRef.get().then(doc => {
                if (doc.exists && doc.data().role === 'admin') {
                    const adminBranch = doc.data().branch;
                    if (adminBranch) {
                        // User is an admin, fetch data for their branch
                        fetchAdminData(adminBranch);
                    } else {
                        console.error("Admin user does not have a branch assigned.");
                    }
                } else {
                    // This will be handled by dashboard-auth.js, but as a fallback:
                    console.log("User is not an admin or does not exist.");
                }
            });
        } else {
            console.log("User not signed in, waiting for redirect.");
        }
    });
});

function fetchAdminData(branch) {
    const dbUsers = db.collection('users');

    // --- 1. Fetch Total Clients for the branch --- //
    const clientsCard = document.querySelector(".card-info:has(h4:contains('Total Clients'))");
    dbUsers.where('branch', '==', branch).where('role', '==', 'client').onSnapshot(snapshot => {
        if (!clientsCard) return;
        
        const totalClients = snapshot.size;
        clientsCard.querySelector('p').textContent = totalClients;

        // You can also add logic for '+5 this month' if you store a joinDate
        clientsCard.querySelector('span').textContent = 'Total active clients';

    }, error => {
        console.error("Error fetching total clients:", error);
    });

    // --- 2. Fetch Recently Added Clients for the branch --- //
    const recentClientsTbody = document.querySelector(".dashboard-section:has(h2:contains('Recently Added Clients')) table tbody");
    dbUsers.where('branch', '==', branch).where('role', '==', 'client').orderBy('joinDate', 'desc').limit(5).onSnapshot(snapshot => {
        if (!recentClientsTbody) return;
        recentClientsTbody.innerHTML = ''; // Clear static rows

        if (snapshot.empty) {
            recentClientsTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No clients found for this branch.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const client = doc.data();
            const joinDate = client.joinDate.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            
            const row = `
                <tr>
                    <td>${doc.id.substring(0, 6).toUpperCase()}</td>
                    <td>${client.companyName}</td>
                    <td>${joinDate}</td>
                    <td><span class="status active">Active</span></td>
                    <td><a href="#" class="btn-small">View Details</a></td>
                </tr>
            `;
            recentClientsTbody.innerHTML += row;
        });

    }, error => {
        console.error("Error fetching recent clients:", error);
        if(recentClientsTbody) {
            recentClientsTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Could not load clients.</td></tr>';
        }
    });

    // --- 3. Placeholder for Total Revenue --- //
    // --- 4. Placeholder for Pending Approvals --- //
}
