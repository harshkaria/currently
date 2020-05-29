const Links = require('../models/links');
const mongoose = require('mongoose')
const Counter = require('../models/counter.js')

// Generates link

// @param: url
// returns: a 5 digit short url that does not exist within the links database
function generateLink(url) {
    console.log(url);
}

// Queries database and tries to find a document with the shortlink
function checkShortLink(url) {
    Links.findOne({
        "clicks": 0
    }, (res, doc) => {
        console.log(res);
        console.log(json(doc));
    });
}
var connection = mongoose.connect('mongodb+srv://admin:nA7KtT7TyJmgHwW@cluster0-so4xi.mongodb.net/Currently?retryWrites=true&w=majority');

connection.then((db) => {
    console.log('connected');
    Counter.remove({}, function() {
        console.log('Counter collection removed');
        var counter = new Counter({_id: 'url_count', count: 1000});
        counter.save(function(err) {
            if(err) return console.error(err);
            console.log('counter inserted');
        });
    });
})