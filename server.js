const express = require('express')
const path = require('path')
const EventEmitter = require('events')
const fs = require('fs').promises;

const eventEmitter = new EventEmitter();

const app = express()
const port = process.env.PORT || 4000
const host = process.env.HOST || 'localhost'
const router = express.Router();

app.use((req, res, next) => {
    eventEmitter.emit('log', `${req.method} ${req.url}`);
    next();
});

app.use(express.json());

app.use(express.static(path.join(__dirname, '.', 'Frontend')));

eventEmitter.on('log', (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'Frontend', 'index.html'));
});

app.listen(port, host, () => {
    eventEmitter.emit('log', `Server kører http://${host}:${port}`);
});

app.get('/read-file', async (req, res) => {
    const filePath = path.join(__dirname, 'data.txt');

    try {
        const data = await fs.readFile(filePath, 'utf8')
        res.send(data);
    } catch (err) {
        eventEmitter.emit('log', `Error while reading file:${err.message}`);
        res.status(500).send('Error while reading file')
    }
})
app.post('/write-file', async (req, res) => {
    const filePath = path.join(__dirname, 'data.txt');
    const fileContent = req.body.content;

    if (!fileContent) {
        eventEmitter.emit('log', 'Data has not been received!');
        return res.status(400).send('Data has not been received!');
    }

    try {
        await fs.writeFile(filePath, fileContent, 'utf8');
        eventEmitter.emit('log', 'File has been created successfully!');
        res.send('File has been created successfully!');
    } catch (err) {
        eventEmitter.emit('log', `Error while writing file: ${err.message}`);
        res.status(500).send('Error while writing file');
    }
});