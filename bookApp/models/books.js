const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
        minlength: 4
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
module.exports = mongoose.model('Book', schema)
