const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Create users table if it doesn't exist
const initializeTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL
        );
    `;
    try {
        await pool.query(createTableQuery);
        console.log('Table "users" is ready.');
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
};

module.exports = { pool, initializeTable };
