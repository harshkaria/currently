// model/links.js
// Houses the links schema

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var LinksSchema = new Schema({
    'url': String,
    'title': String,
    'date': {type: Date, default: Date.now},
    'caption': String,
    'clicks': {type: Number, default: 0}
})

// Export
module.exports = mongoose.model('Links', LinksSchema)