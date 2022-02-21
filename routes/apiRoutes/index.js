// Middleware so the server will know where to look for the routes

const router = require('express').Router();
const notesRoutes = require('./notesRoutes');

router.use(notesRoutes);

module.exports = router;