const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true    
    },
    born: {
        type: Number,
     }
})

schema.plugin(uniqueValidator)
module.exports = mongoose.model('Author', schema)