
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
  Stalking.find({ userId: req.user, "twitter.username": { $exists: true, $not: {$size: 0} } }, function(err, docs){
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      var allTweets = [];
      async.each(docs, function(element, callback){
        require("./user.tweets")({
          userId: element.twitter.userId,
          accessToken: req.userData.twitterToken,
          accessTokenSecret: req.userData.twitterTokenSecret,
          count: req.body.count || 15,
          stalkingId: element._id,
          stalkingDisplayName: element.displayName
        }).then(function(tweets){
          allTweets = allTweets.concat(tweets);
          callback();
        });
      }, function (err){
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        sortedAllTweets = __.sortBy(allTweets, function(el){ return -el.created_time; });
        //console.log("all: ", sortedAllTweets);
        res.send(sortedAllTweets);
      });

  });

}
