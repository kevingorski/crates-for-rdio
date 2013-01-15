var express = require('express');

module.exports = function(app) {
  app.set('views', __dirname + '/../views');
  app.set('view engine', 'jade');

  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/../public'));

  var appSettings = {
    rdio_oauth_request: 'http://api.rdio.com/oauth/request_token',
    rdio_oauth_access: 'http://api.rdio.com/oauth/access_token',
    rdio_oauth_auth: 'https://www.rdio.com/oauth/authorize?oauth_token=',
    rdio_api: 'http://api.rdio.com/1/',
    rdio_api_key: process.env['RDIO_API_KEY'],
    rdio_api_shared: process.env['RDIO_API_SHARED_SECRET']
  };

  Object.keys(appSettings).forEach(function(key) {
    app.set(key, appSettings[key]);
  });
};