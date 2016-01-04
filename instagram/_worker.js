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

var nano = require("nano")("https://beestalk:@selim@123@beestalk.cloudant.com");
var db = nano.use("feeds_instagram");

module.exports.retrieve = function(options){

  var Insta = require('./insta/index.js');

  var I = new Insta({
    access_token: options.accessToken
  });


  return I.get("/users/"+ options.userId +"/media/recent", {
    count: options.count || 50,
    min_id: options.minId
  }).then(function(res){
    return async.each(res.data.data, function(element, callback){
      db.insert({
          userId: options.userId,
          images: element.images,
          link: element.link,
          text: element.caption ? element.caption.text : "",
          created_time: element.created_time,
          id: element.id
        }, function(err){
          if (err) {
            console.log(err);
          }
          callback();
        });
      });
    });
}
