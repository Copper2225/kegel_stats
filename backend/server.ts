import express from 'express';
import cors from 'cors';
import { alleysColumns, DatabaseHandler, mainColumns } from 'database/databaseHandler';

const app = express();

const dH = new DatabaseHandler();

app.use(express.json());
app.use(cors());

const server = app.listen(3002, () => {
    console.log('Server started on port 3002!');
    dH.createTable(mainColumns, 'KegelRecords');
    dH.createTable(alleysColumns, 'Alleys');
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
    const { alleys, total, location, date, training, start } = req.body;
    try {
        const recordId = dH.saveRecord({
            total,
            alleys: alleys.map((alley: any) => ({
                number: alley.number,
                full: alley.full,
                total: alley.total,
                clear: alley.clear,
            })),
            location,
            date,
            training,
            start,
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

app.post('/searchRecords', (req, res) => {
    try {
        const {
            dateFrom = null,
            dateTo = null,
            location = null,
            trainingMode = 'any',
            startLane = null,
            lanes = [1, 2, 3, 4],
        } = req.body || {};

        const records = dH.getFilteredRecords({
            dateFrom,
            dateTo,
            location,
            trainingMode,
            startLane,
            lanes,
        });
        res.json({ success: true, records });
    } catch (error) {
        console.error('Error searching records:', error);
        res.status(500).json({ success: false, error: 'Failed to search records' });
    }
});

app.post('/deleteRecord', (req, res) => {
    const { id } = req.body;
    try {
        const success = dH.deleteRecord(id);
        res.json({ success });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ success: false, error: 'Failed to delete record' });
    }
});
