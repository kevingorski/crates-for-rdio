var player,
  rdioListener = {
    ready: function(userInfo) {
      player = document.getElementById('CratesPlayer');
      console.log(userInfo);
    },
    playStateChanged: function(playState) {
      var state;

      switch(playState) {
        case 0: state = 'paused'; break;
        case 1: state = 'playing'; break;
        case 2: state = 'stopped'; break;
        case 3: state = 'buffering'; break;
        case 4: state = 'paused'; break;
        default: state = '?'; break;
      }

      console.log(playState, state);
    },
    queueChanged: function(newQueue) {
      console.log(newQueue);
    },
    playingSomewhereElse: function() {
      console.log('playing Somewhere Else');
    }
  };

swfobject.embedSWF(
  'http://www.rdio.com/api/swf/',
  'CratesPlayer',
  '1',
  '1',
  '9.0.0',
  '',
  {
    playbackToken: playbackToken,
    domain: encodeURIComponent(document.domain),
    listener: 'rdioListener'
  },
  { allowScriptAccess: 'always' });