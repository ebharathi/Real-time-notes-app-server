const pool = require('../db');
const responseFormatter = require('../utils/FormatResponse');

// Create Note
const createNote = async (req, res) => {
    try {
        const { content } = req.body;
        const { userId } = req.user;

        const newNote = await pool.query(
            'INSERT INTO notes (content, creator, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
            [content, userId]
        );

        return res.status(201).json(responseFormatter({
            error: false,
            message: 'Note created successfully',
            data: newNote.rows[0]
        }));
    } catch (error) {
        console.error('ERROR CREATING NOTE:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

// Read Notes
const readNote = async (req, res) => {
    try {
        const { userId } = req.user;

        const notes = await pool.query(
            'SELECT * FROM notes WHERE creator = $1 ORDER BY created_at DESC',
            [userId]
        );

        return res.status(200).json(responseFormatter({
            error: false,
            message: 'Notes fetched successfully',
            data: notes.rows
        }));
    } catch (error) {
        console.error('ERROR FETCHING NOTES:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};
// Read Note by ID
const getNoteById = async (req, res) => {
    try {
        const { noteId } = req.query;

        const note = await pool.query(
            'SELECT * FROM notes WHERE id = $1',
            [noteId]
        );

        if (note.rows.length === 0) {
            return res.status(404).json(responseFormatter({
                error: true,
                message: 'Note not found'
            }));
        }

        return res.status(200).json(responseFormatter({
            error: false,
            message: 'Note fetched successfully',
            data: note.rows[0]
        }));
    } catch (error) {
        console.error('ERROR FETCHING NOTE:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

// Update Note
const updateNote = async (req, res, io) => {
    try {
        const { noteId, content } = req.body;
        const { userId, email } = req.user;

        // Check if the user is the creator of the note or has write access
        const accessCheck = await pool.query(
            'SELECT * FROM notes WHERE id = $1 AND (creator = $2 OR id IN (SELECT note_id FROM shared_access WHERE email = $3 AND access_level = \'write\'))',
            [noteId, userId, email]
        );

        if (accessCheck.rows.length === 0) {
            return res.status(200).json(responseFormatter({
                error: true,
                message: 'You do not have permission to edit this note'
            }));
        }

        const updatedNote = await pool.query(
            'UPDATE notes SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [content, noteId]
        );

        if (updatedNote.rows.length === 0) {
            return res.status(404).json(responseFormatter({
                error: true,
                message: 'Note not found'
            }));
        }
        //socket to emit

        io.to(noteId).emit("updatedNote", {
            error: false,
            message: 'Note updated successfully',
            data: updatedNote.rows[0]
        })


        return res.status(200).json(responseFormatter({
            error: false,
            message: 'Note updated successfully',
            data: updatedNote.rows[0]
        }));
    } catch (error) {
        console.error('ERROR UPDATING NOTE:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

// Delete Note
const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.body;
        const { userId } = req.user;

        const deletedNote = await pool.query(
            'DELETE FROM notes WHERE id = $1 AND creator = $2 RETURNING *',
            [noteId, userId]
        );

        if (deletedNote.rows.length === 0) {
            return res.status(404).json(responseFormatter({
                error: true,
                message: 'Note not found or you are not authorized to delete it'
            }));
        }

        return res.status(200).json(responseFormatter({
            error: false,
            message: 'Note deleted successfully',
            data: deletedNote.rows[0]
        }));
    } catch (error) {
        console.error('ERROR DELETING NOTE:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

module.exports = {
    createNote,
    readNote,
    updateNote,
    deleteNote,
    getNoteById
};
