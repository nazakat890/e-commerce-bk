
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name:{ type: String, required: true, unique: true},
    description: { type: String },
    users:[{ type: Schema.Types.ObjectId, ref:'users'}],
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission'}]
})

module.exports = mongoose.model('Role', RoleSchema)