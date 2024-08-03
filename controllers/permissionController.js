const PermissionModel = require('../models/Permission')
const userModel = require("../models/User");

const createPermission = async(req, res) => {
    const { name, description } = req.body;
    try {
        const permission = new PermissionModel({ name, description });
        await permission.save();
        res.status(201).json(permission)
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

const getPermissions = async (req, res) => {

    try {
        const permissions = await PermissionModel.find({});
        res.status(200).json({data:permissions})
    }
    catch(error) {
        res.status(400).json({ error: error.message})
    }
}

const getPermission = async (req, res) => {
    try {
        const permission = await PermissionModel.findById(req.params.id)
        if(!permission) return res.status(400).json({error: 'Permission not found'})
        res.status(200).json(permission)
    }
    catch(error) {
        res.status(400).json({ error: error.message})
    }
}

const updatePermission = async (req, res) => {
    try {
         const permission = await PermissionModel.findByIdAndUpdate(req.params.id, req.body, { new: true})
         if(!permission) return res.status(400).json({error: 'Permission not found'})
            res.status(200).json(permission)
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}

const deletePermission = async (req, res) => {
    try {
         const permission = await PermissionModel.findByIdAndDelete(req.params.id)
         if(!permission) return res.status(400).json({error: 'Permission not found'})
            res.status(200).json({messsage: 'Permission deleted successfully'})
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}

module.exports = {
    createPermission,
    getPermissions,
    getPermission,
    updatePermission,
    deletePermission,
}