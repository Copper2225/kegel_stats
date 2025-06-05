import express from 'express';
import cors from 'cors';
import { DatabaseHandler } from 'database/databaseHandler';

const app = express();

const dH = new DatabaseHandler();

app.use(express.json());
app.use(cors());

const server = app.listen(3002, () => {
    console.log('Server started on port 3002!');
    dH.createTable();
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        dH.close();
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        dH.close();
    });
});

app.post('/saveRecord', (req, res) => {
    const { alleys, total, location, date, training } = req.body;
    try {
        const recordId = dH.saveRecord({
            total,
            alleys,
            location,
            date,
            training,
        });
        res.json({ success: true, recordId });
    } catch (error) {
        console.error('Error saving record:', error);
        res.status(500).json({ success: false, error: 'Failed to save record' });
    }
});

app.get('/allRecords', (req, res) => {
    try {
        const records = dH.getAllRecords();
        res.json({ success: true, records });
    } catch (error) {
        console.error('Error getting records:', error);
        res.status(500).json({ success: false, error: 'Failed to load records' });
    }
});
