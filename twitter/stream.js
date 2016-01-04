
var Twit = require('twit');
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

var T = new Twit({
    consumer_key:         config.TWITTER_KEY,
    consumer_secret:      config.TWITTER_SECRET,
    access_token:         '838502425-KkjvuRCLfcKh0s0hR2YOpAzPBA40y0xzkq8gJa5Q',
    access_token_secret:  'MG0018LSOj5LBhHYR0DsqluAEbexMqwKRVpVCR7tpxpIe'
});

var followIds = [];
Stalking.find({"twitter.username": { $exists: true}}).select("twitter.userId -_id").exec(function(err, stalkings){
  stalkings.forEach(function logArrayElements(element, index, array) {
    followIds.push(element.twitter.userId);
  });
  var followJoin = __.uniq(followIds).join(",");
  var stream = T.stream('statuses/filter', { follow: followJoin });
  stream.on('tweet', function (tweet) {
  /*  var pushbots = require('pushbots');
    var Pushbots = new pushbots.api({
        id:'565e5225177959e7798b456a',
        secret:'d05a01fa873175ec99faeb1a7d4f5d2c'
    });
    Pushbots.setMessage(tweet.text ,1);
    Pushbots.customFields({"article_id":"1234"});
    Pushbots.customNotificationTitle(tweet.username + " has just tweeted!");
    Pushbots.push(function(response){
        console.log(response);
    });*/
    console.log(tweet);
  });
});
