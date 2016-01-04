
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
module.exports = function (req, res) {

      var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

      var profileOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        oauth_token: req.userData.twitterToken
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + req.query.username,
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {
          if (err) {
            return res.status(500).send({message: err.message});
          }
          res.send(profile);
      });
}
