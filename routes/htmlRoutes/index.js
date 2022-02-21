// Dependencies
const router = require('express').Router();
// Path for working with file and directory paths
const path = require('path')


// Routes for serving the html pages

// A route for serving the index page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
// A route for serving the notes page
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/notes.html'));
});

// Export the router - making sure there is only one server instance as instantiated in server.js
module.exports = router;