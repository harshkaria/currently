var mongoose = require('mongoose')
var Users = require('../models/Users')
var express = require('express')
const { response } = require('express')
const router = express.Router()


// route

router.get('/', function(req, res, next) {
    //res.send('hi');
    next()
}, (req, res, next=route) => {
    console.log("calledzxx")
    next()
})

var route = router.get('/', function(req, res) {
    res.send('helloharsh');
})

// auth
const signedIn = (req, res, next) => {

}



// user


module.exports = router
