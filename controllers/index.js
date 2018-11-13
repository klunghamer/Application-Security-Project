var express = require('express');
var fileUpload = require('express-fileupload');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
let {PythonShell} = require('python-shell');
var fs = require('fs');

var User = require('../models/user');
var File = require('../models/file');
router.use(fileUpload())

function getFilesizeInMBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes/1000000.0;
}


//Landing page
router.get('/', function (req,res) {
  if (req.session.passport) {
    if (req.session.passport.user) {
      res.redirect('/upload');
    } else {
      res.render('home', {
        title: 'Spellchecker',
        token: req.csrfToken()
      })
    }
  } else {
    res.render('home', {
      title: 'Spellchecker',
      token: req.csrfToken()
    })
  }
});


//Sign up user and go back to landing page
router.post('/signup', function (req,res) {
  console.log(req.body);
  req.body.username = req.sanitize(req.body.username)
  req.body.password = req.sanitize(req.body.password)
  User.register(
    new User({
      username: req.body.username,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        res.send('Invalid username/password')
      } else {
        console.log(user);
        res.render('home', {
        test: 'test',
        token: req.csrfToken()
        })
      }
    })
});


//Log in user
router.post('/login', passport.authenticate('local'), function (req,res) {
  console.log(req.body.remember);
  if (req.body.remember) {
    var hour = 3600000;
    req.session.cookie.maxAge = hour*24; //24 hour session
  }
  req.body.username = req.sanitize(req.body.username)
  req.body.password = req.sanitize(req.body.password)
  req.session.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      User.find({}).exec()
      .then(function(users) {
        res.render('upload', {
          user: req.user,
          token: req.csrfToken()
        })
      })
      .catch(function(err) {
        console.log(err);
        res.redirect('/');
      })
    }
  })
})

router.get('/upload', function (req,res) {
  // console.log(req.csrfToken());
  res.render('upload', {
    token: req.csrfToken(),
    user: req.user,
  })
});

router.post('/upload', function(req, res) {
  if (req.files.newFile.name.slice(-4) !== '.txt') {
    res.send("Invalid input!")
  }
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let newFile = req.files.newFile;
  // Use the mv() method to place the file somewhere on your server
  newFile.mv('output.txt', function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    if (getFilesizeInMBytes('output.txt') > 0.1) {
      res.send("Error in file. Please upload text file less than 100kB.")
    }
      PythonShell.run('spellchecker.py', null, function (err) {
        if (err) return res.send();

        var file = path.join(__dirname, '../', 'output.txt');
        fs.readFile(file, "utf8", function read(err, data) {
          if (err) {
              throw err;
          } else {
              var user = req.session.passport.user;
              User.findOne({username: req.session.passport.user}).exec()
              .then(function(user){
                console.log(user);
                var file = new File({data: data});
                user.file = file;
                return user.save();
              })
              .then(function(user) {
                var file = path.join(__dirname, '../', 'output.txt');
                res.download(file, function(err) {
                  if (err) {
                    if (res.headersSent) {
                      console.log(err)
                    }
                  }
                })
              })
              .catch(function(err){
                console.log(err);
              })
          }
        });
      });
    });
  });


router.get('/download', function (req,res) {
  var data = req.user.file.data;
  fs.writeFile('savedFile.txt', data, { flag: 'w' }, function(err) {
    if (err)
      console.error(err);
      var file = path.join(__dirname, '../', 'savedFile.txt');
      res.download(file, function(err) {
        if (err) {
          if (res.headersSent) {
            console.log(err)
          }
        }
      })
  });
});


//Log out user
router.delete('/signout', function (req,res) {
  req.logout();
  res.redirect('/')
});


module.exports = router;
