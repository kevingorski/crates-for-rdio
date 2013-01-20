var url = require('url'),
  models = require('./models'),
  Crate = models.Crate;

module.exports = function(app){
  var rdio = require('rdio')({
    rdio_api_key: app.get('rdio_api_key'),
    rdio_api_shared: app.get('rdio_api_shared'),
    callback_url: 'http://' + app.get('host') + ":" + app.get('port') + '/oauth/callback'
  });

  app.get('/', function(req, res){
    rdio.getPlaybackToken(
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      app.get('host'),
      function(err, data, response) {
        if(err) throw new Error(err);


        if(req.session.oauth_access_token) {
          // Now get the current user
          rdio.api(
            req.session.oauth_access_token,
            req.session.oauth_access_token_secret,
            {
              method: 'currentUser',
              type: 'User',
              extras: 'username,displayName'
            },
            function(err, userResult, response) {
              if(err) throw new Error(err);


              var user = JSON.parse(userResult).result;

              req.session.userKey = user.key;

              rdio.api(
                req.session.oauth_access_token,
                req.session.oauth_access_token_secret,
                {
                  method: 'getHeavyRotation',
                  type: 'albums',
                  user: user.key,
                  limit: 12
                },
                function(err, rotationResult, response) {
                  if(err) throw new Error(err);


                  var albums = JSON.parse(rotationResult).result;

                  res.render('index', {
                    playbackToken: JSON.parse(data).result,
                    displayName: user.displayName,
                    icon: user.icon,
                    albums: albums
                  });
                });
            });
        } else {
          res.render('index', {
            playbackToken: JSON.parse(data).result
          });
        }
      }
    );
  });

  app.get('/crate/new', function(req, res, params) {
    // Must be authenticated
    if(!req.session.oauth_access_token) return res.redirect('/');

    var crate = new Crate({
      ownerKey: req.session.userKey,
      name: 'Test Crate'
    });

    crate.save(function(err, saved) {
      if(err) console.error(err);

      res.redirect('/crate');
    });
  });

  app.get('/crate', function(req, res, params) {
    // Must be authenticated
    if(!req.session.oauth_access_token) return res.redirect('/');

    Crate.find(function(err, crates) {
      res.render('crates', {
        crates: crates
      });
    });
  });

  app.get ('/clear', function(req, res, params) {
    req.session = null;
    res.redirect('/');
  });

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

        res.redirect("/");
      }
    );
  });
};