var url = require('url'),
  models = require('./models'),
  Crate = models.Crate;

module.exports = function(app, rdio){

  app.get('/crates', function(req, res) {
    // Must be authenticated
    if(!req.session.oauth_access_token) return res.redirect('/');

    Crate.find({ ownerKey: req.session.userKey }, null, { sort: 'createdAt' }, function(err, crates) {
      res.render('crates', {
        crates: crates
      });
    });
  });

};