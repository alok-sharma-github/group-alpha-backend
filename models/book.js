const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: false },
    availability: { type: Boolean, default: false },
    stock: { type: Number, required: false }
});

module.exports = mongoose.model('Book', bookSchema);
