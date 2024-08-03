const userModel = require("../models/User");
const {AppError} = require('../middleware/errorHandler')
const bcrypt = require('bcrypt');
const sendEmail = require("../services/emailService");

const createUser = async (req, res) => {
  const { username, email, roles} = req.body;
  const password = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ username, password: hashedPassword, email, roles});
    await user.save();

    let text  = `Hello, Your account has been created. Here is your password: ${password}
                 Please log in and change your password as soon as possible.
                 Best regards,
                 Your App Team`;
    await sendEmail(email, 'your Account Password',text)

    res.status(201).json({username: user.username, email:user.email, roles:user.roles});

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getUsers = async (req, res, next) => {
  try {
   
    const users = await userModel.find().populate("roles").select('-password');
    res.status(200).json({data:users});
  } catch (error) {
    next(new AppError('Failed to get users', 500));
    // res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).populate("roles");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("roles");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyUser = async (req, res) => {
  const {id} = req.params
  try {
    const user = await userModel.findById(id);
    if(!user) return res.status(404).json({ message: 'User not found'});
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: 'User verified successfully'})
  }
  catch(error) {
    res.status(200).json({ message: error.message})
  }
}

const getUserPermissions  = async (req, res) => {
  const userId = req.user._id;
  try {
      const user = await userModel.findById(userId).populate({
          path: 'roles',
          populate: {
            path: 'permissions'
          }
      });
       
      if(!user) {
       return res.status(404).json({ message: 'User not found' });
      }
      let userpermissions = [];
      user.roles.forEach(role => {
          userpermissions = userpermissions.concat(role.permissions);
      })
      let permissions = userpermissions.map((permission) => permission.name);
      res.status(200).json({permissions})

  } catch(err) {
      res.status(500).json({ message: 'Server error', err })
  }
 
}

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  verifyUser,
  getUserPermissions
};
