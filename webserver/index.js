
var express = require('express');
var cors = require('cors');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors({ origin: "http://app.beestalkapp.com:4000", credentials: true }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

app.use(express.static(path.join(__dirname, '../../client')));

module.exports = app;
