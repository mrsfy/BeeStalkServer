
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
var moment = core.moment;




var retrieveTweets = function(options){

  var Twit = require('twit-promise');

  var T = new Twit({
      consumer_key:         config.TWITTER_KEY,
      consumer_secret:      config.TWITTER_SECRET,
      access_token:         options.accessToken,
      access_token_secret:  options.accessTokenSecret
  });

  return T.get("statuses/user_timeline", {
    user_id: options.userId,
    screen_name: options.username,
    since_id: options.lastId,
    include_rts: true,
    count: (options.count || 50)
  }).then(function(res){
      var tweets = [];
      res.data.forEach(function(element){
        tweets.push({
          type: "twitter",
          text: element.text,
          created_time: moment(element.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').unix(),
          id: element.id_str,
          userId: options.userId,
          stalkingId: options.stalkingId,
          stalkingDisplayName: options.stalkingDisplayName
        });
      });
      return tweets;
    });
}

module.exports = retrieveTweets;

module.exports.get = function(req, res){
  Stalking.findById(req.query.stalkingId, function(err, stalking) {
    if (stalking.twitter.userId) {
      retrieveTweets({
        userId: stalking.twitter.userId,
        accessToken: req.userData.twitterToken,
        accessTokenSecret: req.userData.twitterTokenSecret,
        stalkingDisplayName: stalking.displayName,
        count: req.query.count || 15
      }).then(function(tweets){
        res.send(tweets);
      });
    }else {
      res.send([]);
    }
  });
}
