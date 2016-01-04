
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
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

    // Part 1 of 2: Initial request from Satellizer.
    if (!req.body.oauth_token || !req.body.oauth_verifier) {
      var requestTokenOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        callback: req.body.redirectUri
      };

      // Step 1. Obtain request token for the authorization popup.
      request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
        var oauthToken = qs.parse(body);

        // Step 2. Send OAuth token back to open the authorization screen.
        res.send(oauthToken);
      });
    } else {
      // Part 2 of 2: Second request after Authorize app is clicked.
      var accessTokenOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        token: req.body.oauth_token,
        verifier: req.body.oauth_verifier
      };

      // Step 3. Exchange oauth token and oauth verifier for access token.
      request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

        accessToken = qs.parse(accessToken);

        var profileOauth = {
          consumer_key: config.TWITTER_KEY,
          consumer_secret: config.TWITTER_SECRET,
          oauth_token: accessToken.oauth_token
        };

        // Step 4. Retrieve profile information about the current user.
        request.get({
          url: profileUrl + accessToken.screen_name,
          oauth: profileOauth,
          json: true
        }, function(err, response, profile) {

          // Step 5a. Link user accounts.
          if (req.headers.authorization) {
            User.findOne({ twitter: profile.id }, function(err, existingUser) {
              if (existingUser) {
                return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
              }

              var token = req.headers.authorization.split(' ')[1];
              var payload = jwt.decode(token, config.TOKEN_SECRET);

              User.findById(payload.sub, function(err, user) {
                if (!user) {
                  return res.status(400).send({ message: 'User not found' });
                }

                user.twitter = profile.id;
                user.twitterToken = accessToken.oauth_token;
                user.twitterTokenSecret = accessToken.oauth_token_secret;
                user.displayName = user.displayName || profile.name;
                user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
                console.log(user);
                user.save(function(err) {
                  res.send({ token: createJWT(user) });
                });
              });
            });
          } else {
            // Step 5b. Create a new user account or return an existing one.
            User.findOne({ twitter: profile.id }, function(err, existingUser) {
              if (existingUser) {
                return res.send({ token: createJWT(existingUser) });
              }

              var user = new User();
              user.twitter = profile.id;
              user.twitterToken = accessToken.oauth_token;
              user.displayName = profile.name;
              user.picture = profile.profile_image_url.replace('_normal', '');
              user.save(function(err) {
                if (err) {
                  console.log(err);
                  return res.send({message: err.message});
                }
                res.send({ token: createJWT(user) });
              });
            });
          }
        });
      });
    }
  }
