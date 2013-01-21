// Home

module.exports = function(app, rdio){

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

              res.render('index', {
                playbackToken: JSON.parse(data).result,
                displayName: user.displayName,
                icon: user.icon
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

};