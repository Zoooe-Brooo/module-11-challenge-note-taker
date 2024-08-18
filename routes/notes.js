const notes = require('express').Router();
const { readFile, writeFile } = require('fs');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all notes
notes.get('/', (req, res) => {
  readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json('Error reading file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// GET Route for a specific note
notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json('Error reading file');
    } else {
      const notesArray = JSON.parse(data);
      const result = notesArray.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    }
  });
});

// DELETE Route for a specific note
notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json('Error reading file');
      return;
    }

    let notesArray;
    try {
      notesArray = JSON.parse(data);
    } catch (parseErr) {
      res.status(500).json('Error parsing JSON data');
      return;
    }

    const newNotesArray = notesArray.filter((note) => note.note_id !== noteId);

    writeFile('./db/db.json', JSON.stringify(newNotesArray, null, 2), (err) => {
      if (err) {
        res.status(500).json('Error writing file');
      } else {
        res.json('Note deleted successfully');
      }
    });
  });
});

// POST Route for creating a new note
notes.post('/', (req, res) => {
  console.log(req.body);
  const { title, text } = req.body;

  if (!title || !text) {
    res.status(400).json('Note title and text are required.');
    return;
  }

  const newNote = {
    title,
    text,
    note_id: uuidv4(),
  };
    
  readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json('Error reading file');
      return;
    }

    let notesArray;
    try {
      notesArray = JSON.parse(data);
    } catch (parseErr) {
      res.status(500).json('Error parsing JSON data');
      return;
    }

    notesArray.push(newNote);

    writeFile('./db/db.json', JSON.stringify(notesArray, null, 2), (err) => {
      if (err) {
        res.status(500).json('Error writing file');
      } else {
        res.json('Note added successfully');
      }
    });
  });
});

module.exports = notes;
