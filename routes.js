var url = require('url');

module.exports = function(app, rdio){

  app.get('/', function(req, res){
    rdio.getPlaybackToken(
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      app.get('host'),
      function(err, data, response) {
        if(err) {
          throw new Error(err);
        }
        
        res.render('index', {
          playbackToken: JSON.parse(data).result
        });
      }
    );
  });

  app.get ('/clear', function( req, res, params) {
    req.session = null;
    res.redirect('/');
  });

  app.get ('/oauth/login', function(req, res, params) {
    if(!req.session.oauth_access_token) {
      rdio.getRequestToken(function(error, oauth_token, oauth_token_secret, results){
        if(error) {
          throw new Error(error);
        } else {
          // store the tokens in the session
          req.session.oauth_token = oauth_token;
          req.session.oauth_token_secret = oauth_token_secret;

          // redirect the user to authorize the token
          res.redirect(app.get('rdio_oauth_auth') + oauth_token);
        }
      });
    } else {
      res.redirect("/");
    }
  });

  app.get ('/oauth/callback', function(req, res, params) {
    var parsedUrl = url.parse(req.url, true);

    rdio.getAccessToken(parsedUrl.query.oauth_token, req.session.oauth_token_secret, parsedUrl.query.oauth_verifier,
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        req.session.oauth_access_token = oauth_access_token;
        req.session.oauth_access_token_secret = oauth_access_token_secret;
        res.redirect("/");
      }
    );
  });
};