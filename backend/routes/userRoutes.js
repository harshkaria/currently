var mongoose = require('mongoose')
var Users = require('../models/Users')
var express = require('express')
const { response } = require('express')
const router = express.Router()
const userService = require('../services/UserService')

// route

router.get('/', function(req, res, next) {
    //res.send('hi');
    next()
}, (req, res, next=route) => {
    console.log("called")
    next()
})

router.post('/login', async (req, res, next) => {
    const {handle, password} = req.body;
    const {user, token} = await userService.login(handle, password)

    if(user && token) {
        console.log(user)
        console.log(token)
        res.status(400).send(JSON.stringify({user, token}))
    }
    else {
        res.status(400).send("user not found")
    }
})

router.post('/register', async (req, res) => {
    const {name, handle, email, password} = req.body;
    const user = await userService.register(name, handle, email, password)
    console.log(user.user)
    if(user) {
        res.send(JSON.stringify(user.user))
    }
    else {
        res.status(400).send(JSON.stringify('cant create user'))
    }
})

// auth
const signedIn = (req, res, next) => {

}



// user


module.exports = router
