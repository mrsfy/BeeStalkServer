var jwt = require("jwt-simple");
var request = require("request");
var moment = require('moment');
var qs = require('querystring');
var __ = require("underscore");
var config = require("../config");
var User = require("../database/models/user");
var Stalking = require("../database/models/stalking");
var TrackWorker = require("../database/models/trackWorker");
var StatusInstagram = require("../database/models/status.instagram");
var StatusTwitter = require("../database/models/status.twitter");
var Q = require("q");
var async = require("async");
function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  User.findById(req.user, function(err, user) {
    req.userData = user;
    User.current = user;
    next();
  });
}

//  Generate Json Web Token
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

module.exports = {
  createJWT: createJWT,
  jwt: jwt,
  ensureAuthenticated: ensureAuthenticated,
  moment: moment,
  qs: qs,
  underscore: __,
  request: request,
  config: config,
  User: User,
  Stalking: Stalking,
  async: async,
  StatusInstagram: StatusInstagram,
  StatusTwitter: StatusTwitter
};
