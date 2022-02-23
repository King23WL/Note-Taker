var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");
var recInstruction = $(".recording-instruction");
/////////////////////////////////
//fetch speech-text api
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
} catch (e) {
  console.error(e);
}
var voiceNote = '';
/////////////////////////////////

/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        voiceNote += transcript;
        $noteText.val(voiceNote);
    }
};

recognition.onstart = function() {
  recInstruction.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  recInstruction.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        recInstruction.text('No speech was detected. Try again.');
    };
}

/////////////////////////////////
/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 3;

  window.speechSynthesis.speak(speech);
}
//////////////////////////////////
// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// A function for getting all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// A function for saving a note to the db
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// BONUS A function for deleting a note from the db
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// If the user wants to edit, clear any previous active note, render the note active, delete the old entry, 
//and make the attributes editable. The new note button is hidden so the user does not unintentionally delete a note.
var handleEditBtn = function(event) {
  event.stopPropagation();

  $newNoteBtn.hide();
  $saveNoteBtn.show();

  var note = $(this)
  .parent(".list-group-item")
  .data();

  if (activeNote.id === note.id) {
    $saveNoteBtn.show();
  }

  $noteTitle.attr("readonly", false);
  $noteText.attr("readonly", false);
  $noteTitle.val(note.title);
  $noteText.val(note.text);

  deleteNote(note.id)

};

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
    $newNoteBtn.show();
  });
};

// BONUS Delete the clicked note
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
var handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
var renderNoteList = function(notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $editSpan = $("<span class = 'edit-note'>");
    var $editBtn = $(
      "<i class='far fa-edit float-left text-info'></i>"
    );
    var $delSpan = $("<span class = 'delete-note'>");
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger'>"
    );
    
    $editSpan.append($editBtn);
    $delSpan.append($delBtn);
    $li.append($editSpan, $span, $delSpan);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".edit-note", handleEditBtn);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
//$noteText.on("keyup", handleRenderSaveBtn);
$noteText.on("input",function(){
  voiceNote=$(this).val();
})
$('#start-rec').on('click', function(e) {
  if (voiceNote.length) {
    voiceNote += ' ';
  }
  recognition.start();
});


$('#stop-rec').on('click', function(e) {
  recognition.stop();
  recInstruction.text('Voice recognition paused.');
});


// Gets and renders the initial list of notes
getAndRenderNotes();
