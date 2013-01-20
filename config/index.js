var express = require('express'),
  mongoose = require('mongoose');

module.exports = function(app) {
  require('./all')(app);
  require('./development')(app);
  require('./production')(app);


  mongoose.connect(app.get('mongoUrl'));
  mongoose.connection.on('error', function(err) {
    console.error('Connecting to mongo', err);
  });


  app.use(function(req, res, next) {
    res.locals.oauth_access_token = req.session ? req.session.oauth_access_token : null;

    next();
  });

  app.use(app.router);

  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: false
  }));
};