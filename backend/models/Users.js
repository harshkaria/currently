// models/user.js -- houses users

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var UsersSchema = new Schema({
    'id': Number,
    'username': String,
    'email': String,
    'password': String,
    'date_joined': Date
})

module.exports = mongoose.model("Users", UsersSchema)