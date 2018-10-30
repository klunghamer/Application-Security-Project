var express        = require('express');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var logger         = require('morgan');
var port           = process.env.PORT || 4000;
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var csrf          = require('csurf');
var app            = express();
var User           = require('./models/user');


//dotenv config
require('dotenv').config();

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(logger('dev'));
// app.use(express.static('views'));

//Handlebars
var hbs = require('hbs');
app.set('view engine', 'hbs');
require('handlebars-form-helpers').register(hbs.handlebars);

//Custom handlebars
hbs.registerHelper('checkCategory', function (index, type, options) {
  if(index == type){
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

//Static Assets
app.use(express.static(__dirname + '/public'));

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', function(err) {
  console.log(err);
})
db.once('open', function() {
  console.log('Database Connected!');
})

var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/appsec';
mongoose.connect(mongoURI);


app.use(require('express-session')({
  secret: 'michigan',
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(csrf());
app.use(function(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403).json({"error": "session has expired or tampered with"});
});


//Controllers
var usersController = require('./controllers/index.js');

//Routes
app.use('/', usersController);
// app.use('/helpers', helpersController);

// handle csrf errors specifically
// app.use(function(err, req, res, next) {
//     if (err.code !== 'EBADCSRFTOKEN') return next(err);
//     res.status(403).json({"error": "session has expired or tampered with"});
// });

app.listen(port, function() {
    console.log('=======================');
    console.log('Running on port ' + port);
    console.log('=======================');
});
