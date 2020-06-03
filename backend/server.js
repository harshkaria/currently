const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
//nA7KtT7TyJmgHwW
const dbName = 'Currently'
const dbUrl = process.env.MONGOLAB_URI || `mongodb+srv://admin:nA7KtT7TyJmgHwW@cluster0-so4xi.mongodb.net/${dbName}?retryWrites=true&w=majority`
const port = process.env.PORT || 3001;
const router = express.Router();
const Links = require('./models/links')

// Init bodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

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



router.get('/sl/:shortlink', (req, res, next) => {
    //console.log("shortlink called")
    if(req.params["shortlink"] != null)
        next()
    else {
        res.send(404);
    }
}, function(req, res, next) {
    // Find the long url
    Links.findOne({"short_link": req.params["shortlink"]}, (err, doc) => {
       if(err) {
        res.redirect('https://harshkaria.com')
       }
       else {
           res.redirect(doc.url)
       }
    })
})

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
            // New link, creates an instance of the document
            var link = new Links();
            // we can use req.body because of req.body
            link.url = req.body.url;
            link.caption = req.body.caption;
            link.title = req.body.title;
            // save to database
            link.save((err, document) => {
                if(err) {
                    res.send(err) 
                    console.log(err);
                }
                else {
                    res.json({message: `Added link ${link}`})
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