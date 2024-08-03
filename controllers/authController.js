const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require('../models/User');
const {AppError} = require('../middleware/errorHandler');
const sendEmail = require('../services/emailService');


const register = async (req, res) => {
  const { username, password, email} = req.body;
  try {
     const hashedPassword = await bcrypt.hash(password, 10);
     const user = new UserModel({ username, password: hashedPassword, email })
     await user.save();
     res.status(201).json(user);
  } catch(error) {
     res.status(400).json({ error: error.message})
  }
}

const login = async (req, res) => { 
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username });
        if(!user) return res.status((404)).json({ error : 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
       
        if(!validPassword) return res.status(401).json({ error: 'Invalid password'})

          if(!user.isVerified) {
            return res.status(403).json({ message: 'Your account is not verified. please contact the admin'})
          }
        const token = jwt.sign(
             { id: user._id, roles: user.roles},
             process.env.JWT_SECRET,
             { expiresIn: '15m' }
        );
        res.json({token});
    } catch(error) {
      res.status(500).json({ error: error.message})
    }
}

const forgotPassword = async (req, res, next) => {
        const {email} = req.body;
        const tempPassword = Math.floor(1000 + Math.random() * 9000).toString();
    try {
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const user = await UserModel.findOne({email});

      if(!user) {
        return next(new AppError('User not found', 404));
      }
      //  user.password = hashedPassword;
      //  await user.save();
      const resetToken = jwt.sign(
          { id: user._id}, 
          process.env.JWT_SECRET,
          { expiresIn: '15m' }
        );
      // const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;
      const resetUrl = `http://localhost:4200/auth/reset-password/?token=${resetToken}`;
      await sendEmail(user.email, 'Password Reset', `Please reset your password using the following link :${resetUrl}`)
      res.status(200).json({ message: 'Password reset email sent' })  

      // await sendEmail(user.email, 'Temporary Password', `Your temporary password is :${tempPassword}`)
      //   res.status(200).json({ message: 'Temporary password sent to your email' })  
    }
    catch(error) {
     next(new AppError('Error sending password reset email', 500))
    }
}

resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const {newPassword} = req.body;
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user  = await UserModel.findById(decoded._id);
    if(!user) return next(new AppError('User not found', 404));
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save();
    res.status(200).json({ message: 'Password reset successful' })
  } catch(err) {
    console.log(err)
    next(new AppError('Password reset token is invalid or has expired', 400));
  }
}

changePassword = async (req, res, next) => {
   const {oldPassword, newPassword} = req.body;
   const userId = req.user._id;
   try {
          const user = await UserModel.findById(userId);
          if(!user) {
           return next(new AppError('User not found', 404));
          }
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if(!isMatch) {
            return next(new AppError('Incorret old password', 401))
          }
         user.password = await bcrypt.hash(newPassword, 10);
         await user.save();
         res.status(200).json({ message: 'Password changed successfully' })
   }
   catch(err) {
    next(new AppError('Error changing password', 500))
   }
}

module.exports = {
    register,
    login,
    forgotPassword,
    changePassword,
    resetPassword
}