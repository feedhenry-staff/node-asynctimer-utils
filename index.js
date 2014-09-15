var EventEmitter = require("events").EventEmitter;
var util = require('util');

/* 
  TODO: 

    * set delay

    * get delay

    * set index

    this will allow timers to be updated / reused. 

    for example, when doing multiple tasks, can increase
    the timeout for each step without creating a new object.

    simply update the delay and set the index to something
    identifiable.

    * expire();

    will allow the explicit calling of expiration callback

*/

function AsyncTimeout(config) {

  /*
    config: {
      start:  TRUE/FALSE to start immediately
      delay: Number
    }
  */

  var instance = this;
  instance._config = config ? config : {};

  instance._active = false;
  instance._timer = null;
  instance._paused = false;
  instance._beganTimestamp = null;
  instance._stoppedTimestamp = null;
  instance._timeTaken = null;
  instance._autostart = false;
  instance._delay = 3000;

  instance._init = function() {
    _reset();
    if(instance._autostart && !instance._active) {
      instance.start();
    }
  }

  instance.start = function() {
    if(!instance._active) {
      if(instance._paused) {
        instance.resume();
      } else {
        instance._active = true;
        instance._paused = false;
        instance._beganTimestamp = new Date();
        instance._timer = setTimeout(instance._onComplete, instance._delay);
        instance.emit('start', instance);
      }
    }
  };

  instance.isStarted = function() {
    return instance._active;
  }

  instance.stop = function() {
    if(instance._active) {
      instance._stoppedTimestamp = new Date();
      instance._timeTaken = instance._stoppedTimestamp - instance._beganTimestamp;
      instance._active = false;
      instance._paused = false;
      clearTimeout(instance._timer);
      instance.emit('stop', instance);
    }
  }

  instance.isStopped = function() {
    return !instance._active;
  }

  instance.restart = function() {
    if(instance._active) {
      instance.stop();
    }
    instance.start();
    instance.emit('restart', instance);
  }

  instance.pause = function() {
    if(instance.isAlive()) {
      instance._stoppedTimestamp = new Date();
      instance._timeTaken = instance._stoppedTimestamp - instance._beganTimestamp;
      instance._paused = true;
      instance._delay -= (new Date() - instance._beganTimestamp);
      clearTimeout(instance._timer);
      instance.emit('pause', instance);
    }
  }

  instance.resume = function() {
    if(instance._paused) {
      instance._active = true;
      instance._paused = false;
      instance._beganTimestamp = new Date();
      instance._timer = setTimeout(_onComplete, instance._delay);

      instance.emit('start', instance);
      instance.emit('resume', instance);
    }
  }

  instance.isPaused = function() {
    return instance._paused;
  }

  instance.isAlive = function() {
    return (instance.isStarted() && !instance.isPaused());
  }

  instance.getElaspedTime = function() {
    if(!instance.isPaused && !instance.isStopped) {
      instance._stoppedTimestamp = new Date();
      instance._timeTaken = instance._stoppedTimestamp - instance._beganTimestamp;
    }
    return instance._timeTaken;
  }

  // do a complete reset of internal state
  // only used on initialization & when a 
  // timer expires.
  var _reset = function() {    
    instance._active = false;
    instance._timer = null;

    instance._paused = false;
    instance._beganTimestamp = null;

    instance._autostart = (typeof(instance._config.autostart) !== 'undefined' ? instance._config.autostart : true);
    instance._delay = (typeof(instance._config.delay) !== 'undefined' ? instance._config.delay : 3000);
  }

  var _onComplete = function() {
    if(instance.isAlive()) {
      _reset();
      instance.emit('timeout', instance);
    }
  };

  instance._init();

};

util.inherits(AsyncTimeout, EventEmitter);
module.exports = AsyncTimeout;