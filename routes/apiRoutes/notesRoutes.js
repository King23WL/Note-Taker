// Dependencies
const router = require('express').Router();
const { postNote, validateNote, findById, deleteByID } = require('../../lib/notes');
const shortid = require('shortid');
const { notes } = require('../../db/db');

// Routes used for the Notes API

// A route for requesting notes data
router.get('/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

// A route for requesting notes data by id
router.get('/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
});

// A route for posting a new note
router.post('/notes', (req, res) => {
    // set the id for the new note
    req.body.id = shortid.generate();
    // validate the new note data, and if anything in the req.body is incorrect, send back a 400 error "Bad Request"
    if(!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        // add note to json file and notes array with createNewNote()
        const note = postNote(req.body, notes);
        // send the response (new note) in json format back to the client
        res.json(note);
    }
});

// A route for deleting a note
router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteExists = findById(noteId, notes);
    if (noteExists) {
      const newNotes = deleteByID(noteId, notes);
      res.json(newNotes);
    } 
    else {
      res.send(404);
    }
})

// Export the router - making sure there is only one server instance as instantiated in server.js
module.exports = router;