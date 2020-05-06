// model/links.js
// Houses the links schema

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var LinksSchema = new Schema({
    'url': String,
    'date': {type: Date, default: Date.now},
    'caption': String 
})

// Export
module.exports = mongoose.model('Links', LinksSchema)