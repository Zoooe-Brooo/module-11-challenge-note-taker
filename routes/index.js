const router = require('express').Router();

const notesRouter = require('./notes.js');

router.use('/notes', notesRouter);

module.exports = router;
