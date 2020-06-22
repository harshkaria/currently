const argon2 = require('argon2')
const User = require('../models/Users')
const jwt = require('jsonwebtoken')

class UserService {
    constructor() {
        
    }

    static getJWT(user) {
    
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

    static async register(name, handle, email, password) {
        const hashedPassword = await argon2.hash(password)
        // Check for existing user
        try { 
            const user = new User({
                name: name,
                password: hashedPassword,
                handle: handle,
                email: email
            });
            user.save()
        //console.log(user)

        return {
            user: {
                email: user.email,
                name: user.name,
                handle: user.handle,
            }
        }
        } catch(e) {
            return e;
        }
    }
    static async login(handle, password) {
        try {
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
        } catch(e) {
            return e;
        }
   };
   // @param: user 
   // @returns: a JWT tokene
}

module.exports = UserService