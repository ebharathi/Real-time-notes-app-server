const Router = require("express").Router();
const { createNote, readNote, updateNote, deleteNote, getNoteById } = require("../controllers/notesController");
// Importing middleware
const authMiddleware = require("../middleware/auth");

module.exports = (io) => {

    Router.post("/create", authMiddleware, createNote);
    Router.post("/read", authMiddleware, readNote);

    // Pass io to updateNote function
    Router.post("/update", authMiddleware, (req, res) => updateNote(req, res, io));

    Router.post("/delete", authMiddleware, deleteNote);
    Router.get("/getNote", authMiddleware, getNoteById);

    return Router;
};


