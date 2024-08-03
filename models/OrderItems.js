const mongoose = require('mongoose');
const Product = require('./Product');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    quantity: { type: Number, required: true },
    product: { 
        type: Schema.Types.ObjectId, ref: 'Product'
     },
})

module.exports = mongoose.model('OrderItem', orderItemSchema)