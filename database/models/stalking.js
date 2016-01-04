var mongoose = require("mongoose");

var stalkingSchema = new mongoose.Schema({
    userId: String,
    displayName: String,
    pictureUri: String,
    instagram: {
      displayName: String,
      userId: String,
      username: String
    },
    twitter: {
      displayName: String,
      userId: String,
      username: String
    },
    facebook: {
      username: String
    }
});


module.exports = mongoose.model("Stalking", stalkingSchema);
