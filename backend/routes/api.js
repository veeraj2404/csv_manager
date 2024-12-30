
const express = require("express");
const router = express.Router();
const db = require('../db/connection')



router.get('/excelData', (req, res) => {
    console.log("Calling getExcelData function");

    const query = 'SELECT * FROM fileData'

    db.query(query, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });

});

router.get('/excelDataCount/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT file_id, filename FROM fileData WHERE user_id = ( ? ) ';

    db.query(query, [userId], (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});


router.get('/excelDataById/:id', (req, res) => {
    const dataId = req.params.id;
    const query = 'SELECT * FROM fileData WHERE file_id = (?)';

    db.query(query, [dataId], (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});


router.post('/saveExcelData', (req, res) => {
    const data = req.body.excelData.data;
    const fileName = req.body.excelData.fileName;
    const userId = req.body.excelData.userId;

    // Check if excelData exists in the request body
    if (!data) {
        return res.status(400).send('excelData is required');
    }

    const fileData = JSON.stringify(data);
    const query = 'INSERT INTO fileData (file, filename, user_id) VALUES (?, ?, ?)';

    db.query(query, [fileData, fileName, userId], (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL table:', err);
            throw err;
        }
        console.log('Data inserted into MySQL table successfully');
        res.status(200).json({fileId: results.insertId});
    });
});

router.post('/updateExcelData', (req, res) => {
    const id = req.body.data.id;
    const excelData = req.body.data.editableData;
    
    // Check if excelData exists in the request body
    if (!id || !excelData) {
        return res.status(400).send('Something is missing');
    }

    const fileData = JSON.stringify(excelData);
    const query = 'UPDATE fileData SET file = (?) WHERE file_id = (?)';

    db.query(query, [fileData, id], (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL table:', err);
            throw err;
        }
        console.log('Data updated into MySQL table successfully');
        res.status(200).send('Data updated into MySQL table successfully');
    });
});


module.exports = router;