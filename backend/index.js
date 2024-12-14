const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool, initializeTable } = require('./db/setup');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the database table
initializeTable();

// Routes
// Insert data into the database
app.post('/api/data', async (req, res) => {
    const { name, email } = req.body;
    try {
        const newEntry = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.json(newEntry.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users from the database
app.get('/api/data', async (req, res) => {
    try {
        const allData = await pool.query('SELECT * FROM users');
        res.json(allData.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
