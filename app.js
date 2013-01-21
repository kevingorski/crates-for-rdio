var express = require('express'),
  rdio = require('rdio');


var app = express(),
  rdioClient;

require('./config')(app);

rdioClient = rdio({
  rdio_api_key: app.get('rdio_api_key'),
  rdio_api_shared: app.get('rdio_api_shared'),
  callback_url: 'http://' + app.get('host') + ":" + app.get('port') + '/oauth/callback'
});

require('./lib/home')(app, rdioClient);
require('./lib/authentication')(app, rdioClient);

require('./routes')(app, rdioClient);
require('./lib/crate')(app, rdioClient);

app.listen(app.get('port'));

console.log('Server started on port ' + app.get('port'));