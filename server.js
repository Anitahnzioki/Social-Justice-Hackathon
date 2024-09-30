const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require("mysql");

require('dotenv').config();



const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "Corruption_Reporting",
});

// Test connection and create tables if not exists
db.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL as id:", connection.threadId);

    // Create tables
    const createTablesQueries = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            amount DECIMAL(10, 2) NOT NULL,
            date DATE DEFAULT CURRENT_TIMESTAMP,
            category VARCHAR(255),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        
    ];

    createTablesQueries.forEach(query => {
        connection.query(query, (err) => {
            if (err) {
                console.error("Error creating table:", err);
            } else {
                console.log("Table created/checked successfully");
            }
        });
    });

    connection.release();
});

// In-memory storage for reports
let reports = [];

// Endpoint to submit a report
app.post('/report', (req, res) => {
    const { title, description } = req.body;
    reports.push({ title, description });
    res.status(201).json({ message: 'Report submitted successfully!' });
});

// Endpoint to retrieve reports
app.get('/reports', (req, res) => {
    res.json(reports);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
