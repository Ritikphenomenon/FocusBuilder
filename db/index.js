const mongoose = require("mongoose");

// Define todo schema
const todoSchema = new mongoose.Schema({
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User who owns the todo
});

// Define note schema
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User who owns the note
});


// Define user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    profilePhoto: { type: String },
    // Any other user-related fields can be added here
});

// Create models
const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);
const Note = mongoose.model('Note', noteSchema);

module.exports = { User, Todo, Note };
