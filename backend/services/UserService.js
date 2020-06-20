const argon2 = require('argon2')
const User = require('../models/Users')
const jwt = require('jsonwebtoken')

class UserService {
    constructor() {
        
    }
    static async register(name, handle, password, email) {
        const hashedPassword = await argon2.hash(password)

        const user = new User({
            name: name,
            password: hashedPassword,
            handle: handle,
            email: email
        });

        return {
            user: {
                email: user.email,
                name: user.name,
                handle: user.handle,
            }
        }
    }
    static async login(handle, password) {
        var user = await User.findOne({handle: handle})
        if(!user) {
            throw new Error('User not found');
        }
        else {
            const verifyPwd = argon2.verify(user.password, password)
            if(!verifyPwd) {
                throw new Error('Password cannot be verified');
            }
        }
        return {
            user: {
                email: user.email,
                handle: user.handle,
                name: user.name,
            },
            // Generate JWT
            token: this.getJWT(user),
        }
   };
   // @param: user 
   // @returns: a JWT tokene
   getJWT(user) {
       
       const payload = {
            email: user.email,
            handle: user.handle,
            name: user.name,
       }
       const secret = 'CURRENTLYDEPLOYMENTFILLER'
       const token = jwt.sign(payload, secret, {
           expiresIn: '3h'
       })
       return token
   }
}