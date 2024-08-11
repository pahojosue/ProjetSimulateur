const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.get('/data', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
            return;
        }
        res.send(JSON.parse(data));
    });
});

app.post('/data', (req, res) => {
    const newData = req.body;
    fs.writeFile('./data.json', JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) {
            res.status(500).send('Error saving data');
            return;
        }
        res.json({ message: 'Data saved successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
