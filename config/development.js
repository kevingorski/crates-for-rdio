var express = require('express');

module.exports = function(app) {
  app.use(express.cookieSession({
    secret: 'development'
  }));


  var appSettings = {
    port: 3000,
    host: 'localhost'
  };

  Object.keys(appSettings).forEach(function(key) {
    app.set(key, appSettings[key]);
  });
};