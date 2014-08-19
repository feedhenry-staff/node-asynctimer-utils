var EventEmitter = require("events").EventEmitter;
var util = require('util');

function AsyncTimeout(config) {

  /*
    config: {
      start:  TRUE/FALSE to start immediately
      delay: Number
    }
  */

  config = config ? config : {};

  var instance = this;
  instance._active = false;
  instance._timer = null;

  instance._paused = false;
  instance._began = null;

  instance._autostart = (typeof(config.autostart) !== 'undefined' ? config.autostart : true);
  instance._delay = (typeof(config.delay) !== 'undefined' ? config.delay : 3000);

  instance.init = function() {
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
        instance._began = new Date();
        instance._timer = setTimeout(instance._onComplete, instance._delay);
        instance.emit('start');
      }
    }
  };

  instance.isStarted = function() {
    return instance._active;
  }

  instance.stop = function() {
    if(instance._active) {
      instance._active = false;
      instance._paused = false;
      clearTimeout(instance._timer);
      instance.emit('stop');
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
    instance.emit('restart');
  }

  instance.pause = function() {
    if(instance.isAlive()) {
      instance._paused = true;
      instance._delay -= (new Date() - instance._began);
      clearTimeout(instance._timer);
      instance.emit('pause');
    }
  }

  instance.resume = function() {
    if(instance._paused) {
      instance._active = true;
      instance._paused = false;
      instance._began = new Date();
      instance._timer = setTimeout(instance._onComplete, instance._delay);

      instance.emit('start');
      instance.emit('resume');
    }
  }

  instance.isPaused = function() {
    return instance._paused;
  }

  instance.isAlive = function() {
    return (instance.isStarted() && !instance.isPaused());
  }

  instance._onComplete = function() {
    if(instance.isAlive()) {
      instance.emit('timeout');
    }
  };

  instance.init();

};

util.inherits(AsyncTimeout, EventEmitter);
module.exports = AsyncTimeout;