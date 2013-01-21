// Authentication

var url = require('url');

module.exports = function(app, rdio){
  app.get('/oauth/login', function(req, res, params) {
    if(req.session.oauth_access_token) {
      res.redirect('/');
      return;
    }

    rdio.getRequestToken(function(err, oauth_token, oauth_token_secret, results){
      if(err) throw new Error(error);

      // store the tokens in the session
      req.session.oauth_token = oauth_token;
      req.session.oauth_token_secret = oauth_token_secret;

      // redirect the user to authorize the token
      res.redirect(app.get('rdio_oauth_auth') + oauth_token);
    });
  });

  app.get('/oauth/callback', function(req, res, params) {
    var parsedUrl = url.parse(req.url, true);

    rdio.getAccessToken(parsedUrl.query.oauth_token, req.session.oauth_token_secret, parsedUrl.query.oauth_verifier,
      function(err, oauth_access_token, oauth_access_token_secret, results) {
        if(err) throw new Error(error);

        req.session.oauth_access_token = oauth_access_token;
        req.session.oauth_access_token_secret = oauth_access_token_secret;

        res.redirect('/');
      }
    );
  });

  app.get ('/oauth/logout', function(req, res, params) {
    req.session = null;
    res.redirect('/');
  });
};