var express = require('express');

module.exports = function(app) {
  app.configure('development', function() {
    app.use(express.cookieSession({
      secret: 'development'
    }));


    var appSettings = {
      port: 3000,
      host: 'localhost',
      mongoUrl: 'mongodb://localhost/Crates'
    };

    Object.keys(appSettings).forEach(function(key) {
      app.set(key, appSettings[key]);
    });
  });
};