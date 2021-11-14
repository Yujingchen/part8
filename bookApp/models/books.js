const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    author: {
        type: String,
        require: true
    },
    published: {
        type: Number,
        require: true
    },
    genres: {
        type: [{type: 'String'}]
    },
    // info: {
    //     type: {published: 'Number', genres: {type: ['String']}}
    // }
})

schema.plugin(uniqueValidator);
const Book = mongoose.model('Book', schema)
module.exports = Book
