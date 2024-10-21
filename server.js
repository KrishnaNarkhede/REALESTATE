const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');  // Added to handle file paths

const app = express();
const port = 3000;

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Change as necessary
    password: '',  // Change as necessary
    database: 'cp_database'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Handle POST request for booking appointment form submission
app.post('/book_appointment', (req, res) => {
    const { name, email, mobile, service_type, appointment_date, appointment_time, message } = req.body;

    const sql = "INSERT INTO appointments (name, email, mobile, service_type, appointment_date, appointment_time, message) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [name, email, mobile, service_type, appointment_date, appointment_time, message], (err, result) => {
        if (err) {
            console.error("Error executing query", err);
            res.status(500).send("Error booking appointment");
        } else {
            res.send("Appointment booked successfully!");
        }
    });
});

// Handle POST request for contact form submission
app.post('/process_contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    const sql = "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error("Error executing query", err);
            res.status(500).send("Error submitting message");
        } else {
            res.send("Message sent successfully!");
        }
    });
});

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,))
}
)

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});