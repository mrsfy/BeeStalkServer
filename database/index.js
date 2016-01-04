
var mongoose = require('mongoose');
var config = require("./../config");

mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongodb`');
});
module.exports = mongoose;
