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

  var workers = {
    instagram: require("../instagram/_worker"),
    twitter: require("../twitter/_worker")
  }

  var workerQueues = {};
  for (var site in workers) {
    workerQueues[site] = [];
  }
  var promises = [];
  Stalking.find().stream()
    .on('data', function(doc){
        promises.push(new Promise(function(resolve, reject){
          User.findById(doc.userId, function(err, data){
          if (err) {
            console.log("Task user err: ", err);
            reject();
            return;
          }
          // Oauth 2.0
          for (var site in workers) {
            (site != "twitter" && (typeof doc[site].userId != "undefined")) && workerQueues[site].push({ userId: doc[site].userId, accessToken: data[site + "Token"] });
          }
          // Oauth 1.0
          (typeof doc.twitter.userId != "undefined") && workerQueues.twitter.push({ userId: doc.twitter.userId, accessToken: data.twitterToken, accessTokenSecret: data.twitterTokenSecret });
          resolve();
        })
      }));
    })
    .on('error', function(err){
      console.log("Task error: ", err);
    })
    .on('end', function(){
        Promise.all(promises).then(function(){
          var sites = [];
            for (var site in workers) {
              sites.push(site);
            }
            async.each(sites, function(site, callback){
              //  workerQueues[site] = __.uniq(workerQueues[site], "userId");
                async.each(workerQueues[site], function(element, callback){
                  workers[site].retrieve(element).then(function(){
                    callback();
                  });
                }, function(err){
                  if (err) {
                    console.log(site+" task retrieve err", err);
                  }
                  callback();
              });
            }, function(err){
              if (err) {
                console.log("sites async err: ", err);
              }
              console.log("All tasks ended!!!");
            })
        });
    });
