var request = require("request");

var Insta = function(config){
  var self = this;
  config.apiURL = "https://api.instagram.com/v1";

  self.get = function (path, params, callback) {
    params.access_token = config.access_token;
    return new Promise(function(resolve, reject){
      request.get({url: config.apiURL + path, qs: params, json: true}, function(err, res, data){
        if (err) {
          console.log(err);
          reject(err)
        }else {
          resolve({
            response: res,
            data: data
          });
        }
      });
    });
  }
};

module.exports = Insta;
