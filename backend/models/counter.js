var mongoose = require('mongoose')
var Schema = mongoose.Schema


// New Schema with particular object parameters
// Links: _id, count: counter to increment, and url
var CounterSchema = new Schema({
    _id: {type: String, required: true},
    count: {type: Number, default: 0},
    url: ''
})



module.exports = mongoose.model('counters', CounterSchema)