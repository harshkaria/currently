const argon2 = require('argon2')
const User = require('../models/Users')

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
}