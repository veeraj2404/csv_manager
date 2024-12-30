const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db/connection');

dotenv.config();

const authRoute = require('./routes/auth');
const apiRoute = require('./routes/api');

// Middleware to parse JSON requests

const app = express();
const PORT = 5000;

app.use(express.json());
// Enable CORS for all routes
app.use(cors());


//Route
app.use('/', authRoute)
app.use('/task', apiRoute)


app.listen(PORT, () => {console.log("Server started on port 5000")})