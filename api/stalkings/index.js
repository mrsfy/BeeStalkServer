
var core = require("../../core");
var ensureAuthenticated = core.ensureAuthenticated;
var createJWT = core.createJWT;
var jwt = core.jwt;
var __ = core.underscore;
var request = core.request;
var config = core.config;
var User = core.User;
var Stalking = core.Stalking;

  function get(req, res){
    var findOptions = {
      userId: req.user
    };
    var stalkingId = req.query.stalkingId;
    if (stalkingId) {
      findOptions._id = stalkingId;
    }

    Stalking.find(findOptions, function(err, docs){
      res.send(docs);
    });
  };

  function put(req, res){
    /*if (req.body.instagram.username) {
      var feedUrl = 'https://api.instagram.com/v1/users/self/follows';
      var params = { access_token: req.userData.instagramToken };
      request.get({ url: feedUrl, qs: params, json: true }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var instagramUser = __.find(body.data, function(data){
            return data.username == req.body.instagram.username;
          });
        }
        if (!instagramUser) {
          return res.status(400).send({message: "Instagram user not found: " + req.body.instagram.username});
        }
      }
    }*/

       Stalking.findByIdAndUpdate(req.body._id, req.body, function (err, doc) {
         if (err){
            return res.status(500).send(err);
         }
         res.send(doc);
       });
    };

    function post(req, res){
        var stalking = new Stalking({
          userId: req.user,
          displayName: req.body.displayName,
          pictureUri: req.body.pictureUri || "app/content/images/egg.png",
          twitter: {
            username: req.body.twitter.username,
            displayName: req.body.twitter.displayName,
            userId: req.body.twitter.userId,
          },
          instagram: {
            username: req.body.instagram.username,
            displayName: req.body.instagram.displayName,
            userId: req.body.instagram.userId
          },
          facebook: {
            username: req.body.facebook.username
          }
        });

        stalking.save(function(err, result) {
          if (err){
            console.log(err);
            return res.status(500).send({ message: err.message });
          }
          res.send(result);
        });

    }

    function del(req, res){
      Stalking.findByIdAndRemove(req.query.stalkingId, function(err, result){
        if (err) {
        res.status(500).send({ message: err.message });
        }
        res.send(result);
      });
    }

module.exports = {
  get: get,
  put: put,
  post: post,
  del: del
}
