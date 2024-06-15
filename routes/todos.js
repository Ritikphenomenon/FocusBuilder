const express = require('express');
const { Todo,User } = require('../db');
const { authenticateJwt } = require('../middleware/index');

const router = express.Router();

// Create a todo
router.post('/todo', authenticateJwt, async (req, res) => {
    try {
        const { description } = req.body;
        // Extract user ID from authenticated user's information
        const user = await User.findOne({ username: req.user.username });
        const userId = user._id;
        const todo = new Todo({ description, user: userId }); // Associate todo with authenticated user
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ message: 'Server error while creating todo' });
    }
});

// Get all todos
router.get('/todo', authenticateJwt, async (req, res) => {
    try {
        // Extract user ID from authenticated user's information
        const user = await User.findOne({ username: req.user.username });
        const userId = user._id;
        
        // Fetch all todos associated with the user
        const todos = await Todo.find({ user: userId });

        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Server error while fetching todos' });
    }
});



// Delete a todo by ID
router.delete('/todo/:id', authenticateJwt, async (req, res) => {
    try {
        const todoId = req.params.id;
        const user = await User.findOne({ username: req.user.username });
        const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: user._id });
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }
        res.json({ message: 'Todo deleted successfully', deletedTodo });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Server error while deleting todo' });
    }
});

// Update the completion status of a todo
router.patch('/todo/:id', authenticateJwt, async (req, res) => {
    try {
        const todoId = req.params.id;
        const { completed } = req.body;
        
        const user = await User.findOne({ username: req.user.username });

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, user: user._id },
            { completed },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Server error while updating todo' });
    }
});

// Get all todos associated with the authenticated user
router.get('/todo', authenticateJwt, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        const todos = await Todo.find({ user: user._id });
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Server error while fetching todos' });
    }
});

module.exports = router;
