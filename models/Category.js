
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    icon: {
        type: String,
    },
    image:{
        type:String,
        
    },
})

module.exports = mongoose.model('Category', categorySchema)