const RoleModel = require('../models/Role');


const createRole = async (req, res) => {
    const {name, description, permissions } = req.body;
            try {
                const role = new RoleModel({ name, description, permissions});
                await role.save();
                res.status(201).json(role);
            } catch(error) {
                res.status(400).json({error: error.message});
            }
}

const getRole = async (req, res) => {
    try {
        const role = await RoleModel.findById(req.params.id).populate('permissions')
        if(!role) return res.status(404).json({error:'Role not found'})
        res.status(200).json(role)
    }
    catch(error) {
        res.status(400).json({ error: error.message})
    }
}

const getRoles = async (req, res) => {
    try  {
        const roles = await RoleModel.find().populate('permissions')
        res.status(200).json({data:roles})
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}

const updateRole = async (req, res) => {
  try {
    const role = await RoleModel.findByIdAndUpdate(req.params.id, req.body, {new:true}).populate('permissions')
    if(!role) return res.status(404).json({error:'Role not found'})
        res.status(200).json(role)
  } catch(error) {
    res.status(400).json({ error: error.message})
  }
}

const deleteRole = async (req, res) => {
   try {
    const role = await RoleModel.findByIdAndDelete(req.params.id);
    if(!role) return res.status(404).json({error:'Role not found'})
    res.status(200).json({message:'Role deleted successfully'});
   }
   catch(error) {
    res.status(400).json({ error: error.message})
   }

}


module.exports = {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRole
}


