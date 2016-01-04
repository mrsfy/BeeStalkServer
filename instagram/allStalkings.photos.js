
var core = require("../core");
var ensureAuthenticated = core.ensureAuthenticated;
var createJWT = core.createJWT;
var jwt = core.jwt;
var __ = core.underscore;
var request = core.request;
var config = core.config;
var User = core.User;
var Stalking = core.Stalking;
var qs = core.qs;
var async = core.async;


module.exports = function (req, res) {
    Stalking.find({ userId: req.user, instagram: { $exists: true } }, function(err, docs){
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        var allPhotos = [];
        async.each(docs, function(element, callback){
          require("./user.photos")({
            userId: element.instagram.userId,
            accessToken: req.userData.instagramToken,
            count: req.body.count || 15,
            stalkingId: element._id,
            stalkingDisplayName: element.displayName
          }).then(function(photos){
            allPhotos = allPhotos.concat(photos);
            callback();
        });
      }, function (err){
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
          sortedAllPhotos = __.sortBy(allPhotos, function(el){ return -el.created_time; });
      //    console.log("all: ", sortedAllPhotos);
          return res.send(sortedAllPhotos);
      });
    });

}
