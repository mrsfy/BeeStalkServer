var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  email: { type: String, lowercase: true },
  password: { type: String, select: false },
  displayName: String,
  picture: String,
  instagram: String,
  twitter: String,
  foursquare: String,
  foursquareToken: String,
  instagramToken: String,
  twitterToken: String,
  twitterTokenSecret: String,
  facebook: String,
  facebookToken: String,
  google: String,
  googleToken: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
