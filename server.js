// Express.js server for Note Taker

// Dependencies
// Express.js for the web server
const express = require('express');
// File server for writing to files
const fs = require('fs');
// Path for working with file and directory paths
const path = require('path')
// Note data in JSON format
const { notes } = require('./db/db');
// Routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// Set the port to either per environmental variable or 3001 on a local machine
const PORT = process.env.PORT || 3001;

// Instantiate the server
const app = express()

// Parse incoming string or array data (POST)
app.use(express.urlencoded({ extended: true }));

// Parse incoming JSON data (POST)
app.use(express.json());

// Define the routes using the modularized files
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Use the public folder for all static http requests (i.e. don't require separate routes for CSS, images, etc.)
app.use(express.static('public'));

// app.get('/api/notes', (req,res) => {
//     res.json(notes)
// })

// Set up the port for requests (must be last in the file)
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}. Press CTRL C to exit.`)
});