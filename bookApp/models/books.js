const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    published: {
        type: Number,
        require: true
    },
    genres: {
        type: [{type: 'String'}]
    },
    author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Author'
    }
})

schema.plugin(uniqueValidator);
const Book = mongoose.model('Book', schema)
module.exports = Book
