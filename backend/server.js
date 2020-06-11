const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const twilio = require('twilio')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
//nA7KtT7TyJmgHwW
const dbName = 'Currently'
const dbUrl = process.env.MONGOLAB_URI || `mongodb+srv://admin:nA7KtT7TyJmgHwW@cluster0-so4xi.mongodb.net/${dbName}?retryWrites=true&w=majority`
const port = process.env.PORT || 3001;
const router = express.Router();
const Links = require('./models/links')
var titleGrab = require('get-title-at-url')

// Init bodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// TwilioState 
var TwilioState = {
    url: null,
    caption: null
}

// Helper functions=
// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

// Makes a web request taking in a url as a parameter 
// returns a promise of the title of the web page
var getTitleFromTwilioMessage = function(link) {
    return new Promise(function (resolve, reject) {
        titleGrab(link, (title, err) => {
            if(!err) {
                resolve(title);
            }
            else {
                reject(err);
            }
        });
    });
}

// Posts a link to the server
// Callback returns: [shortlink, err]
var postLinkToServer = function(linkObject, callback) {
    var link = new Links();
    // we can use req.body because of req.body
    link.url = linkObject.url;
    link.caption = linkObject.caption;
    link.title = linkObject.title;
    // save to database
    link.save((err, document) => {
        if(err) {
            callback(null, err)
            console.log(err);
        }
        else {
            // Return shorturl in callback
            callback(document.short_link, null)
            //res.json({shortURL: document.short_link})
        }
    })
}

// Add headers for CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Connect to our database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB Connected')
})

router.post('/twilio', (req, res) => {
    var twiml = new MessagingResponse()
    // Apple ShareSheet will send two consecutive messages, so we have to get the second one and parse
    if(TwilioState.url != null) {
        TwilioState.caption = req.body.Body
        // form Link Object 
        var linkObject = {
            url: TwilioState.url,
            caption: TwilioState.caption,
            title: TwilioState.title,
        }
        postLinkToServer(linkObject, (shortURL, err) => {
            twiml.message(`http://harshkaria.com/${shortURL} and ${TwilioState.caption} was sent`)
            console.log(`${TwilioState.url} and ${TwilioState.caption} was sent`)
            // Clear the state
            TwilioState.url = null
            TwilioState.caption = null
            TwilioState.title = null;
            res.writeHead(200, {'Content-Type': 'text/xml'})
            res.end(twiml.toString())
        })
    }
    if(TwilioState.url == null && isValidURL(req.body.Body)) {
        TwilioState.url = req.body.Body
        getTitleFromTwilioMessage(TwilioState.url).then((title, rej) => {
            if(!rej)
                TwilioState.title = title;
            res.end()
        })
    }
})

router.get('/sl/:shortlink?', (req, res, next) => {
    //console.log("shortlink called")
    if(req.params["shortlink"] != null)
        next()
    else {
        res.send('welcome to sl api')
    }
}, function(req, res, next) {
    // Find the long url
    let url = req.params["shortlink"];
    // Update the click count 
    let apiCall = new Promise(function(resolve, reject) {
            Links.findOneAndUpdate({"short_link": url}, { 
            // Increment click, updating..
            $inc: {
                'clicks': 1
            }}, function (error, document, result) {
                    // console.log(error, document, result)
                    if(error) {
                       // console.log(error);
                       reject(error)
                    }
                    else {
                        // console.log(document);
                        resolve(document)
                    }
                }
            );
        });
        // Execute the PUT API call aynchronously and return the updated document from the promise
        apiCall.then((data, rej) => {
            if(rej) 
                res.json(rej)
            else {
                // Redirect upon success
                res.redirect(data.url)
            }
        });
});

// Add the /links route
router.route('/links')
        .get((req, res) => {
            Links.find({}).sort({"date": 'descending'}).exec((err, items) => {
                if(err) 
                    res.send(err);
                // Sends back the items 
                res.json(items)
            })
        })
        .post((req, res) => {
            // New link
            var link = {};
            // we can use req.body because of req.body
            link.url = req.body.url;
            link.caption = req.body.caption;
            link.title = req.body.title;
            // save to database
            postLinkToServer(link, (shortlink, err) => {
                    if(err != null) {
                        res.send(err) 
                        console.log(err);
                    }
                    else {
                        res.json({shortURL: shortlink})
                    }
                })
            })
        // If we want to send a put request, we need the link url and update the `click_count`
        // Updates the click counter
        .put((req, res) => {
            var url = req.body.url;
                // Increment click count asynchronously
                let apiCall = new Promise(function(resolve, reject) {
                    Links.findOneAndUpdate({"url": url}, { 
                    // Increment click
                    $inc: {
                        'clicks': 1
                    }}, function (error, document, result) {
                            // console.log(error, document, result)
                            if(error) {
                               // console.log(error);
                               reject(error)
                            }
                            else {
                                // console.log(document);
                                resolve(document)
                            }
                        }
                    );
                });
            // Execute the PUT API call aynchronously and return the updated document
            apiCall.then((data, rej) => {
                if(rej) 
                    res.json(rej)
                else {
                    res.json(data);
                }
            });
        });


        
        
function logOriginalUrl (req, res, next) {
    console.log('Request URL:', req.originalUrl)
    next()
  }
  
  function logMethod (req, res, next) {
    console.log('Request Type:', req.method)
    next()
  }
  
  var logStuff = [logOriginalUrl, logMethod]
  router.get('/user/:id', logStuff, function (req, res, next) {
    res.send('User Info')
  })
  

// Expose the /api route
app.use('/api', router)

app.listen(port, function() {
    console.log(`listening on ${port}`)
})

module.exports = mongoose, router