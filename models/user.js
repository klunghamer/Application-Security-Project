var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var FileSchema = require('./file').schema;

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  file: FileSchema
})

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);

module.exports = User;
