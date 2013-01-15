var express = require('express');

var app = express();

app.configure(function() { require('./config/all')(app); });
app.configure('development', function() { require('./config/development')(app); });
app.configure('production', function() { require('./config/production')(app); });

app.use(function(req, res, next){
  res.locals.oauth_access_token = req.session ? req.session.oauth_access_token : null;

  next();
});

app.use(app.router);

app.use(express.errorHandler({
  dumpExceptions: true,
  showStack: false
}));


var rdio = require('rdio')({
  rdio_api_key: app.get('rdio_api_key'),
  rdio_api_shared: app.get('rdio_api_shared'),
  callback_url: 'http://' + app.get('host') + ":" + app.get('port') + '/oauth/callback'
});

// Routes
require('./routes')(app, rdio);

app.listen(app.get('port'));

console.log('Server started on port ' + app.get('port'));