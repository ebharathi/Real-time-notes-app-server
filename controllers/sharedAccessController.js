const pool = require('../db');
const responseFormatter = require('../utils/FormatResponse');

// Grant Access
const grantAccess = async (req, res) => {
    try {
        const { noteId, email, accessLevel } = req.body;

        // Validate access level
        if (!['read', 'write'].includes(accessLevel)) {
            return res.status(400).json(responseFormatter({
                error: true,
                message: 'Invalid access level. Must be "read" or "write".'
            }));
        }

        // Check if access already exists
        const existingAccess = await pool.query(
            'SELECT * FROM shared_access WHERE note_id = $1 AND email = $2',
            [noteId, email]
        );

        if (existingAccess.rows.length > 0) {
            return res.status(400).json(responseFormatter({
                error: true,
                message: 'Access already granted to this user for the note.'
            }));
        }

        // Grant access
        const newAccess = await pool.query(
            'INSERT INTO shared_access (note_id, email, access_level, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
            [noteId, email, accessLevel]
        );

        return res.status(201).json(responseFormatter({
            error: false,
            message: 'Access granted successfully.',
            data: newAccess.rows[0]
        }));
    } catch (error) {
        console.error('ERROR GRANTING ACCESS:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

// Update Access
const updateAccess = async (req, res) => {
    try {
        const { noteId, email, accessLevel } = req.body;

        // Validate access level
        if (!['read', 'write'].includes(accessLevel)) {
            return res.status(400).json(responseFormatter({
                error: true,
                message: 'Invalid access level. Must be "read" or "write".'
            }));
        }

        // Update access level
        const updatedAccess = await pool.query(
            'UPDATE shared_access SET access_level = $1, updated_at = NOW() WHERE note_id = $2 AND email = $3 RETURNING *',
            [accessLevel, noteId, email]
        );

        if (updatedAccess.rows.length === 0) {
            return res.status(404).json(responseFormatter({
                error: true,
                message: 'Access not found or you are not authorized to update it.'
            }));
        }

        return res.status(200).json(responseFormatter({
            error: false,
            message: 'Access level updated successfully.',
            data: updatedAccess.rows[0]
        }));
    } catch (error) {
        console.error('ERROR UPDATING ACCESS:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

// Revoke Access
const revokeAccess = async (req, res) => {
    try {
        const { noteId, email } = req.body;

        // Delete access
        const deletedAccess = await pool.query(
            'DELETE FROM shared_access WHERE note_id = $1 AND email = $2 RETURNING *',
            [noteId, email]
        );

        if (deletedAccess.rows.length === 0) {
            return res.status(404).json(responseFormatter({
                error: true,
                message: 'Access not found or you are not authorized to delete it.'
            }));
        }

        return res.status(200).json(responseFormatter({
            error: false,
            message: 'Access revoked successfully.',
            data: deletedAccess.rows[0]
        }));
    } catch (error) {
        console.error('ERROR REVOKING ACCESS:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

// List Shared Accesses
const listAccesses = async (req, res) => {
    try {
        const { noteId } = req.query;
        const { userId } = req.user;

        const note = await pool.query(
            'SELECT creator FROM notes WHERE id = $1',
            [noteId]
        );

        if (note.rows.length === 0 || note.rows[0].creator !== userId) {
            return res.status(200).json(responseFormatter({
                error: true,
                message: 'You are not authorized to access it.'
            }));
        }

        const accesses = await pool.query(
            'SELECT * FROM shared_access WHERE note_id = $1',
            [noteId]
        );

        return res.status(200).json(responseFormatter({
            error: false,
            message: 'Shared accesses fetched successfully.',
            data: accesses.rows
        }));
    } catch (error) {
        console.error('ERROR FETCHING ACCESSES:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

// Verify Access
const verifyAccess = async (req, res) => {
    try {
        const { noteId } = req.body;
        const { userId, email } = req.user;


        const access = await pool.query(
            'SELECT * FROM shared_access WHERE note_id = $1 AND email = $2',
            [noteId, email]
        );

        if (access.rows.length > 0) {
            return res.status(200).json(responseFormatter({
                error: false,
                message: 'Access granted.',
                data: access.rows[0]
            }));
        } else {
            //check if it is the creator
            const note = await pool.query(
                'SELECT creator FROM notes WHERE id = $1',
                [noteId]
            );
            if (note.rows.length > 0 && note.rows[0].creator == userId) {
                return res.status(200).json(responseFormatter({
                    error: false,
                    message: 'Admin Access granted.',
                }));
            }

            return res.status(200).json(responseFormatter({
                error: true,
                message: 'Unauthorized access.'
            }));
        }
    } catch (error) {
        console.error('ERROR VERIFYING ACCESS:', error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error'
        }));
    }
};

module.exports = {
    grantAccess,
    updateAccess,
    revokeAccess,
    listAccesses,
    verifyAccess
};
