const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;
const path = require('path');

app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the logs table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    timestamp TEXT NOT NULL
)`);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/logs', (req, res) => {
    db.all(`SELECT * FROM logs`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/recognize', (req, res) => {
    const { name, timestamp } = req.body;
    db.run(`INSERT INTO logs (name, timestamp) VALUES (?, ?)`, [name, timestamp], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ id: this.lastID });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Server is running. Use /logs to view the logs.');
});
