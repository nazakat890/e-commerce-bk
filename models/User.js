
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{ type: String, required: true, unique: true},
    password:{ type: String, required: true},
    email:{ type: String, required: true, unique: true},
    isVerified: { type: Boolean, default: false },
    roles:[{ type: Schema.Types.ObjectId, ref: 'Role'}],
    createdAt:{ type: Date, default: Date.now},
    updatedAt:{ type: Date, default: Date.now},
    isAdmin:{ type: Boolean, default: false },
    city:String,
    zip:String,
    apartment:String,
    street:String,
    country:String,
    phone:String
    // fullName: { type: String, required:true},
    // dateofBirth: { type: Date, required:true},
    // mobileNumber: { type: String, required:true},
    // occupation: { type: String, required:true},
    // gender: { type:String, enum: ['Male', 'Female', 'other'], required:true}
})

module.exports = mongoose.model('User', UserSchema);
