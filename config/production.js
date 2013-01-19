var express = require('express');

module.exports = function(app) {
  app.use(express.cookieSession({
    secret: process.env['SESSION_SECRET']
  }));

  
  var appSettings = {
    // port: 3000,
    // host: 'localhost',
    // mongoUrl: 'mongodb://localhost/Crates'
  };

  Object.keys(appSettings).forEach(function(key) {
    app.set(key, appSettings[key]);
  });
};