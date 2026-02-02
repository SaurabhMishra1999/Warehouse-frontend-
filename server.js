const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Database path
const dbPath = path.join(__dirname, 'db.json');

// Helper function to read database
const readDB = () => {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
};

// Helper function to write to database
const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin', (req, res) => {
    if (req.session.isAdmin) {
        res.sendFile(path.join(__dirname, 'admin.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'dashboard.html'));
    } else {
        res.redirect('/login');
    }
});

// API routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const admin = db.users.find(u => u.username === username && u.role === 'admin');

    if (admin && await bcrypt.compare(password, admin.password)) {
        req.session.isAdmin = true;
        res.json({ success: true, redirect: '/admin' });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/bookings', (req, res) => {
    if (req.session.isAdmin) {
        const db = readDB();
        res.json(db.bookings);
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/api/bookings', (req, res) => {
    const newBooking = req.body;
    const db = readDB();
    newBooking.id = Date.now();
    newBooking.status = 'pending'; // Default status
    db.bookings.push(newBooking);
    writeDB(db);
    res.json({ success: true, message: 'Booking submitted successfully!' });
});

app.put('/api/bookings/:id', (req, res) => {
    if (req.session.isAdmin) {
        const { id } = req.params;
        const { status } = req.body;
        const db = readDB();
        const booking = db.bookings.find(b => b.id == id);
        if (booking) {
            booking.status = status;
            writeDB(db);
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Booking not found' });
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
