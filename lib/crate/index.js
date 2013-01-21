// Crate
var models = require('../../models'),
  Crate = models.Crate,
  Album = models.Album;

module.exports = function(app, rdio){

  app.get('/crate/new', function(req, res) {
    // Must be authenticated
    if(!req.session.oauth_access_token) return res.redirect('/');

    var crate = new Crate({
      ownerKey: req.session.userKey,
      name: 'Test Crate',
      albums: []
    });

    crate.save(function(err, saved) {
      if(err) console.error(err);

      res.redirect('/crates');
    });
  });

  app.del('/crate/:id', function(req, res) {
    Crate.findByIdAndRemove(req.params.id, function(err) {
      if(err) throw err;

      res.redirect('/crates');
    });
  });


  function loadCrate (req, res, next) {
    var crateId = req.params.id;

    if(!crateId) return res.redirect('/crates');

    Crate.findById(crateId, function(err, crate) {
      if(err) throw err;

      req.crate = crate;

      next();
    });
  }

  function loadAlbums (req, res, next) {
    var crate = req.crate;

    if(!crate.albumKeys || !crate.albumKeys.length) return next();

    rdio.api(
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      {
        method: 'get',
        type: 'albums',
        keys:  crate.albumKeys.join(','),
        limit: 12
      },
      function(err, albumsResult) {
        if(err) throw new Error(err);

        req.crateAlbums = JSON.parse(albumsResult).result;

        next();
      });
  }

  function loadHeavyRotation (req, res, next) {
    rdio.api(
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      {
        method: 'getHeavyRotation',
        type: 'albums',
        user: req.session.userKey,
        limit: 12
      },
      function(err, rotationResult) {
        if(err) throw new Error(err);

        req.heavyRotationAlbums = JSON.parse(rotationResult).result;

        next();
      });
  }

  app.get('/crate/:id', loadCrate, loadAlbums, loadHeavyRotation, function(req, res) {
    res.render('crate', {
      crate: req.crate,
      crateAlbums: req.crateAlbums,
      heavyRotationAlbums: req.heavyRotationAlbums
    });
  });

  app.post('/crate/:id',
    loadHeavyRotation,
    function(req, res, next) {
      var album = req.body,
        updateAction = {},
        setAction;

      switch (req.body.action) {
        case 'addAlbum': setAction = '$addToSet'; break;
        case 'removeAlbum': setAction = '$pull'; break;
        default: throw new Error('Unknown action "' + req.body.action + '."');
      }

      updateAction[setAction] = { albumKeys: album.key };

      Crate.findByIdAndUpdate(req.params.id,
        updateAction,
        function(err, updated) {
          req.crate = updated;

          next();
        });

    },
    loadAlbums,
    function(req, res) {
      res.render('crate', {
        crate: req.crate,
        crateAlbums: req.crateAlbums,
        heavyRotationAlbums: req.heavyRotationAlbums
      });
    });


  app.get('/crate/:id/edit', loadCrate, function(req, res) {
    if(req.crate.ownerKey !== req.session.userKey) return res.redirect('/crate/' + req.crate.id );

    res.render('editCrate', {
      crate: req.crate,
      crateAlbums: req.crateAlbums
    });
  });


  app.post('/crate/:id/edit', function(req, res) {
    Crate.findByIdAndUpdate(req.params.id,
      { $set: { 'name': req.body.name } },
      function(err, updated) {
        res.render('editCrate', {
          crate: updated,
          crateAlbums: req.crateAlbums
        });
      });
  });

};