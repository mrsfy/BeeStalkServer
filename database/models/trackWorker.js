var mongoose = require("mongoose");

var trackWorkerSchema = new mongoose.Schema({
  site: String,
  userId: String,
  time: String,
  minId: String
});


module.exports = mongoose.model("TrackWorker", trackWorkerSchema);
