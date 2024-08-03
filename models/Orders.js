
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    orderItems: [{  type: Schema.Types.ObjectId, ref: 'OrderItem' }],
    shippingAddress1:{ type:String, required: true },
    shippingAddress2:{ type:String },
    city:{ type:String, required: true },
    state: { type:String, required: true },
    zip: { type:String, required: true },
    phone: { type:Number, required: true },
    country: { type:String, required: true },
    orderDate: {type: Date, default: Date.now},
    order_status: {type: String, required: true, default: 'Pending'},
    order_totalPrice: { type: Number },
    users: { type: Schema.Types.ObjectId, ref:'User' }
})

module.exports = mongoose.model('Order', ordersSchema)