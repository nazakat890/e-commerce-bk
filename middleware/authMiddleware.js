const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const authMiddleware = (requiredPermissions = []) => {
    return async (req, res, next) => {
   
        const authHeader = req.headers['authorization']
        if(!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(403).json({error:'No token provided'})
        }
          const token = authHeader.split(' ')[1];
            try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id).populate({
                path: 'roles',
                populate: {
                  path: 'permissions'
                }
            });

            if(!user.isVerified) {
                return res.status(403).json({ message: 'your account is not authorized. plesae contact the admin'})
            }
            if(!user) return res.status(401).json({ message: 'Unauthorized'})

            req.user = user;
            const userPermissions = [];
            user.roles.forEach(role => {
                role.permissions.forEach(permission => {
                    if(!userPermissions.includes(permission.name)) {
                        userPermissions.push(permission.name)
                    }
                })
                
            });
         
            if(requiredPermissions.length > 0) {
                const hasPermissons = requiredPermissions.some(permission =>  userPermissions.includes(permission));
                if(!hasPermissons){
                    return res.status(403).json({ message: 'Access denied'})
                }
            }
            next()
            }
            catch(error) {
                console.log(error)
              res.status(500).json({ error: 'Failed to authenticate token' });
            }
    }
      
 }

module.exports = authMiddleware;