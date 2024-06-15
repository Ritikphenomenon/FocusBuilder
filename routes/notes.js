const express = require('express');
const { Note,User } = require('../db');
const { authenticateJwt } = require('../middleware/index');

const router = express.Router();

// Create a note
router.post('/note', authenticateJwt, async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // Find the user by username to get the user ID
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const note = new Note({ title, content, user: user._id }); // Associate note with user ID
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Server error while creating note' });
    }
});

// Delete a note by ID
router.delete('/note/:id', authenticateJwt, async (req, res) => {
    try {
        const noteId = req.params.id.trim();

        const user = await User.findOne({ username: req.user.username });

        const deletedNote = await Note.findOneAndDelete({ _id: noteId, user: user._id });
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }
        res.json({ message: 'Note deleted successfully', deletedNote });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Server error while deleting note' });
    }
});

// Update a note by ID
router.patch('/note/:id', authenticateJwt, async (req, res) => {
    try {
        const noteId = req.params.id.trim();
        

        const { title, content } = req.body;
        const user = await User.findOne({ username: req.user.username });
       
        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, user: user._id},
            { title, content },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }
        res.json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Server error while updating note' });
    }
});

// Get all notes associated with the authenticated user
router.get('/note', authenticateJwt, async (req, res) => {
    try {
        
        const user = await User.findOne({ username: req.user.username });
        const notes = await Note.find({ user: user._id });
        res.json(notes);
    } catch (error) {
       console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Server error while fetching notes' });
    }
});

module.exports = router;
