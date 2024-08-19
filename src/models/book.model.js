const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    publicationYear: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    pages: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('books', bookSchema);
