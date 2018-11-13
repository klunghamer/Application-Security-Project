var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
  data: String
})

var File = mongoose.model('File', FileSchema);

module.exports = File;
