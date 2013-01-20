var express = require('express'),
  app = express();

require('./config')(app);
require('./routes')(app);

app.listen(app.get('port'));

console.log('Server started on port ' + app.get('port'));