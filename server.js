"use strict";


var app = require("./webserver");
var database = require("./database");

var core = require("./core");
var ensureAuthenticated = core.ensureAuthenticated;
var createJWT = core.createJWT;
var jwt = core.jwt;
var __ = core.underscore;
var request = core.request;
var config = core.config;
var User = core.User;
var Stalking = core.Stalking;
//require("./twitter/stream");

require("./tasks/allStalkings.queue");

var api_me = require("./api/me");
app.get('/api/me', ensureAuthenticated, api_me.get);
app.put('/api/me', ensureAuthenticated, api_me.put);
var api_stalkings = require("./api/stalkings");
app.get("/api/me/stalkings", ensureAuthenticated, api_stalkings.get);
app.put("/api/me/stalkings", ensureAuthenticated, api_stalkings.put);
app.post("/api/me/stalkings", ensureAuthenticated, api_stalkings.post);
app.delete("/api/me/stalkings", ensureAuthenticated, api_stalkings.del);

var authSites = ["facebook", "twitter", "instagram", "foursquare", "google"]
authSites.forEach(function(element){
  app.post('/auth/' + element, require("./" + element + "/auth"));
});

var unlinkAuth = require("./api/unlink");
app.post('/auth/unlink', ensureAuthenticated, unlinkAuth);

// Twitter
var twitterUserShow = require("./twitter/user.show");
app.get("/twitter/users/show", ensureAuthenticated, twitterUserShow);

var allStalkingsTweets = require("./twitter/allStalkings.tweets");
app.get("/twitter/allStalkings/tweets", ensureAuthenticated, allStalkingsTweets);

// Instagram
var allStalkingsPhotos = require("./instagram/allStalkings.photos");
app.get("/instagram/allStalkings/photos", ensureAuthenticated, allStalkingsPhotos);

// Instagram Photos
var twitterUserTweets = require("./twitter/user.tweets");
app.get("/twitter/user/tweets", ensureAuthenticated, twitterUserTweets.get);

// Twitter Tweets
var instagramUserPhotos = require("./instagram/user.photos");
app.get("/instagram/user/photos", ensureAuthenticated, instagramUserPhotos.get);

// Start the server
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
