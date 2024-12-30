const express = require("express");
const router = express.Router();
const fs = require('fs');
const Papa = require('papaparse');
const bcrypt = require('bcrypt');
const db = require('../db/connection')


router.post('/register', async (req, res) => {
    const {userName, email, password} = req.body.user;
    const storedHashedPassword = await hashPassword(password);

    // Check if user exists in the request body
    if (!userName || !email || !password) {
        return res.status(400).send('user is required');
    }

    const query = 'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)';
    const selectQuery = 'SELECT * from users WHERE email = ?'; 

    db.query(query, [userName, email, storedHashedPassword], (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL table:', err);
            throw err;
        }
        db.query(selectQuery, [email], (err, results) => {
            if (err) {
                console.error('Error inserting data into MySQL table:', err);
                throw err;
            }
            const user = results[0];
            res.status(200).json({ message: 'Successfully Registered!!!', user });
        })
    });
});

router.post('/login', (req, res) => {

    const email = req.body.user.email;
    const password = req.body.user.password;

    // Check if user exists in the request body
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const query = 'SELECT * from users WHERE email = ?';

    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL table:', err);
            throw err;
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }
        const user = results[0];

        // Check if entered password matches the stored hashed password
        const isMatch = await checkPassword(password, user.password);

        if (isMatch) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(400).json({ message: 'Invalid password' });
        }
    });
});

router.get('/downloadExcel/:id', (req, res) => {

    const dataId = req.params.id;

    const query = 'SELECT file, filename FROM fileData WHERE file_id = (?)';

    db.query(query, [dataId], (err, results) => {
        if (err) {
            throw err;
        }

        const dataString = results[0].file;
        const data = JSON.parse(dataString);
        
        
        const csvData = Papa.unparse(data);

        fs.writeFileSync('data.csv', csvData);

        res.download('data.csv', results[0].filename, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            }
            fs.unlinkSync('data.csv'); // Delete the file after download
        });
  

    });
});


// Function to hash the password
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

// Function to check if entered password matches the stored hashed password
const checkPassword = async (enteredPassword, storedHashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error checking password:', error);
        return false;
    }
};


module.exports = router;