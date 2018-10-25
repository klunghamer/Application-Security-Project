var express        = require('express');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var logger         = require('morgan');
var port           = process.env.PORT || 4000;
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var methodOverride = require('method-override');
var app            = express();
var User           = require('./models/user');
// var Item           = require('./models/item');

// var requestIp = require('request-ip');

//dotenv config
require('dotenv').config();

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.static('views'));

// app.use('/scripts', express.static(__dirname + '/bower_components'))

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
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Controllers
// var usersController = require('./controllers/users.js');
// var helpersController = require('./controllers/helpers.js');

//Routes
// app.use('/users', usersController);
// app.use('/helpers', helpersController);

app.listen(port, function() {
    console.log('=======================');
    console.log('Running on port ' + port);
    console.log('=======================');
});
