// Dependencies
// File server for writing to files
const fs = require('fs');
// Path for working with file and directory paths
const path = require('path')


// Functions for notesRoutes.js

// A function to post a note
function postNote(body, notes) {
    // set the note data to the input text
    const note = body;
    // add the note to the array
    notes.push(note);
    // write to the json file, without editing data, with whitespace
    fs.writeFileSync(
        path.join(__dirname,'../db/db.json'),
        JSON.stringify({ notes }, null, 2)
    )
    // return the note to the post route
    return note;
}

// A function to validate a note
function validateNote(note) {
    if(!note.title || typeof note.title !== 'string') {
        return false;
    }
    if(!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}

// A function for filtering the JSON data by a single ID (GET)
function findById(id, notes) {
    const result = notes.filter(note => note.id === id)[0];
    return result;
}

// A function to delete a JSON object by ID (DELETE)
function deleteByID(id, notes) {
    // identify the note to be deleted
    const toBeDeleted = notes.filter(note => note.id === id)[0];
    // identify the index of that note
    const indexResult = notes.indexOf(toBeDeleted);
    // remove the note at the index of the identified id
    notes.splice(indexResult, 1);
    // write to the json file
    fs.writeFileSync(
        path.join(__dirname,'../db/db.json'),
        JSON.stringify({ notes }, null, 2)
    )
    // return the new notes array to the delete route
    return notes;
}


// Export the functions for use in notesRoutes.js
module.exports = {
    postNote,
    validateNote,
    findById,
    deleteByID
  };