
var core = require("../core");
var ensureAuthenticated = core.ensureAuthenticated;
var createJWT = core.createJWT;
var jwt = core.jwt;
var __ = core.underscore;
var request = core.request;
var config = core.config;
var User = core.User;
var Stalking = core.Stalking;
var qs = core.qs


var retrievePhotos = function(options){

  var Insta = require('./insta/index.js');

  var I = new Insta({
    access_token: options.accessToken
  });


  return I.get("/users/"+ options.userId +"/media/recent", {
    count: options.count || 50,
    min_id: options.minId
  }).then(function(res){
    var photos = [];
      res.data.data.forEach(function(element){
        photos.push({
          type: "instagram",
          images: element.images,
          link: element.link,
          text: element.caption ? element.caption.text : "",
          created_time: element.created_time,
          id: element.id,
          stalkingId: options.stalkingId,
          stalkingDisplayName: options.stalkingDisplayName
        });
      });
      return photos;
    });
}

module.exports = retrievePhotos;

module.exports.get = function(req, res){
  Stalking.findById(req.query.stalkingId, function(err, stalking){
    if (stalking.instagram.userId) {
      retrievePhotos({
        userId: stalking.instagram.userId,
        accessToken: req.userData.instagramToken,
        count: req.query.count || 15,
        stalkingDisplayName: stalking.displayName
    }).then(function(photos){
        res.send(photos);
      });
    }else {
      res.send([]);
    }
  });
}
