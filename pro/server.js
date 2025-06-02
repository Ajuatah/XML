const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // set your password
    database: "hospital_db"
});
db.connect(err => {
    if (err) throw err;
    console.log("MySQL connected.");
});

// Create tables if not exist
db.query(`CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(50),
    name VARCHAR(100)
)`);
db.query(`CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    room VARCHAR(20),
    sickness VARCHAR(100),
    doctor_id INT,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
)`);

// Dummy doctor for testing
db.query(`INSERT IGNORE INTO doctors (username, password, name) VALUES ('doctor1', 'passboris', 'Dr. boris')`);

// Doctor sign-in
app.post("/api/signin", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM doctors WHERE username=? AND password=?", [username, password], (err, results) => {
        if (err) return res.json({ success: false });
        if (results.length === 1) {
            res.json({ success: true, doctor: results[0] });
        } else {
            res.json({ success: false });
        }
    });
});

// Get patients for a specific doctor
app.get("/api/patients/:doctor_id", (req, res) => {
    const doctor_id = req.params.doctor_id;
    db.query(
        `SELECT patients.*, doctors.name AS doctor_name 
         FROM patients 
         JOIN doctors ON patients.doctor_id = doctors.id 
         WHERE doctor_id = ?`,
        [doctor_id],
        (err, results) => {
            if (err) return res.status(500).json([]);
            res.json(results);
        }
    );
});

// Register patient
app.post("/api/patients", (req, res) => {
    const { name, age, room, sickness, doctor_id } = req.body;
    db.query("INSERT INTO patients (name, age, room, sickness, doctor_id) VALUES (?, ?, ?, ?, ?)",
        [name, age, room, sickness, doctor_id],
        (err, result) => {
            if (err) return res.json({ success: false });
            res.json({ success: true });
        }
    );
});

// Get all patients (optionally filter by doctor)
app.get("/api/patients", (req, res) => {
    db.query(`SELECT patients.*, doctors.name AS doctor_name FROM patients JOIN doctors ON patients.doctor_id = doctors.id`, (err, results) => {
        if (err) return res.json([]);
        res.json(results);
    });
});

// Delete patient
app.delete("/api/patients/:id", (req, res) => {
    db.query("DELETE FROM patients WHERE id=?", [req.params.id], (err, result) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

// Serve XML data for home.xml
app.get("/home.xml", (req, res) => {
    db.query(`SELECT patients.*, doctors.name AS doctor_name FROM patients JOIN doctors ON patients.doctor_id = doctors.id`, (err, results) => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?><Hospital><Patients>`;
        results.forEach(p => {
            xml += `<Patient>
                <Id>${p.id}</Id>
                <Name>${p.name}</Name>
                <Age>${p.age}</Age>
                <Room>${p.room}</Room>
                <Sickness>${p.sickness}</Sickness>
                <Doctor>${p.doctor_name}</Doctor>
            </Patient>`;
        });
        xml += `</Patients></Hospital>`;
        res.type("application/xml").send(xml);
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));