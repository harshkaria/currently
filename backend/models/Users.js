// models/user.js -- houses users

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var UsersSchema = new Schema({
    'name': {
        type: String,
        required: true
    },
    'handle': {
     type: String, 
     required: true
    },
    'email': {
        type: String, 
        required: true
    },
    'password': {
        type: String, 
        required: true
           
    },
    'date_joined': {
        type: Date,
        default: Date.now()
    }

    // TODO: One to many relationship between user -> link 
})

module.exports = mongoose.model("Users", UsersSchema)