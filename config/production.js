var express = require('express');

module.exports = function(app) {
  app.use(express.cookieSession({
    secret: process.env['SESSION_SECRET']
  }));
};