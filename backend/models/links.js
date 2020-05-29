// model/links.js
// Houses the links schema

var mongoose = require('mongoose')
var Schema = mongoose.Schema
const Counter = require('./counter.js')
const atob = require('atob')
const btoa = require('btoa')


var LinksSchema = new Schema({
    'url': String,
    'title': String,
    'date': {type: Date, default: Date.now},
    'caption': String,
    'clicks': {type: Number, default: 0},
    'short_link': {type: String}
})

// With guidance from https://scalegrid.io/blog/how-to-build-a-url-shortener-with-node-js-and-mongodb/
// Before saving,
/* we want to:
 store the short link hash 
 in the document after incrementing the counter */

LinksSchema.pre('save', function(next) {
   // console.log('pre saving');
    // current document (should be able to reference the current document here and then update the clicks within the 
    // code)
    var current = this;
    Counter.findByIdAndUpdate({_id: 'url_count'}, { $inc: {
        count: 1
    }}, (err, counter) => {
        if(err) {
            //console.log(err)
        }
        else {
           // console.log("this is" + current['clicks']);
            //console.log(btoa(counter.count))
            current['short_link'] = btoa(counter.count);
            next();
        }
    }
)

}) 
// Export
module.exports = mongoose.model('Links', LinksSchema)