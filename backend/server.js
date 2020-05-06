const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
//nA7KtT7TyJmgHwW
const dbName = 'Currently'
const dbUrl = `mongodb+srv://admin:nA7KtT7TyJmgHwW@cluster0-so4xi.mongodb.net/${dbName}?retryWrites=true&w=majority`
const port = process.env.API_PORT || 3001;
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
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected')
})

router.get('/', (req, res) => {
    res.send('hello world')
})

// Add the /links route
router.route('/links')
        .get((req, res) => {
            Links.find((err, items) => {
                if(err) 
                    res.send(err);
                // Sends back the items 
                res.json(items)
            })
        })
        .post((req, res) => {
            // New link
            var link = new Links();
            // we can use req.body because of req.body
            link.url = req.body.url;
            link.caption = req.body.caption;
            // save to database
            link.save((err) => {
                if(err)
                    res.send(err)
                res.json({message: `Added link ${link}`})
            })

        });

// Expose the /api route
app.use('/api', router)

app.listen(port, function() {
    console.log(`listening on ${port}`)
})

module.exports = mongoose