var mongoose = require("mongoose");

var stalkingSchema = new mongoose.Schema({
    userId: String,
    displayName: String,
    pictureUri: String,
    stalking: {
      id: String,
      username: String,
      displayName: String,
      pictureUri: String
    },
    post: {
      id: String,
      images: Object,
      text: String
      link: String,
      created_time: String
    }

});


module.exports = mongoose.model("StatusInstagram", stalkingSchema);
