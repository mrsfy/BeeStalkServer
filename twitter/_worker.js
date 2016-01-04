var core = require("../core");
var ensureAuthenticated = core.ensureAuthenticated;
var createJWT = core.createJWT;
var jwt = core.jwt;
var __ = core.underscore;
var request = core.request;
var config = core.config;
var User = core.User;
var Stalking = core.Stalking;
var async = core.async;
var moment = core.moment;

var nano = require("nano")("https://beestalk:@selim@123@beestalk.cloudant.com");
var db = nano.use("feeds_twitter");

module.exports.retrieve = function(options){

  var Twit = require('twit-promise');

  var T = new Twit({
      consumer_key:         config.TWITTER_KEY,
      consumer_secret:      config.TWITTER_SECRET,
      access_token:         options.accessToken,
      access_token_secret:  options.accessTokenSecret
  });

  return T.get("statuses/user_timeline", {
    user_id: options.userId,
    include_rts: true,
    count: (options.count || 50)
  }).then(function(res){
    return async.each(res.data, function(element, callback){
      db.insert({
          text: element.text,
          created_time: moment(element.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').unix(),
          id: element.id_str,
          userId: options.userId,
        }, function(err){
          if (err) {
            console.log(err);
          }
          callback();
        });
      });
    });
}
