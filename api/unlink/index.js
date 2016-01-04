
var core = require("../../core");
var User = core.User;

module.exports = function(req, res) {
  var provider = req.body.provider;
  var providers = ["twitter", "instagram", "foursquare", "facebook"];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
}
