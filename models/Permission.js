const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const PermissionSchema = new Schema({
name: { type: String, required: true, unique: true },
description: { type: String },
roles:[{ type: Schema.Types.ObjectId, ref: 'Role'}],
// read:{ type:Boolean, default: false },
// create:{type:Boolean, default: false },
// edit:{ type:Boolean, default: false },
// canDelete:{ type:Boolean, default: false },

})

module.exports = mongoose.model('Permission', PermissionSchema)