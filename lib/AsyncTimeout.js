var EventEmitter = require("events").EventEmitter;
var util = require('util');

function AsyncTimeout(config) {

/* 
  TODO: 

    * set delay

    * set index

    this will allow timers to be updated / reused. 

    for example, when doing multiple tasks, can increase
    the timeout for each step without creating a new object.

    simply update the delay and set the index to something
    identifiable.

*/

  var instance = this;
  instance._config = config ? config : {};

  instance._active = false;
  instance._timer = null;
  instance._paused = false;
  instance._began = null;
  instance._autostart = false;
  instance._delay = 1000;

  instance._init = function() {
    instance._reset();
    if(instance._autostart && !instance._active) {
      instance.start();
    }
  };

  // start a timer (use with autostart set to false)
  instance.start = function() {
    if(!instance._active) {
      if(instance._paused) {
        instance.resume();
      } else {
        instance._active = true;
        instance._paused = false;
        instance._began = new Date();
        instance._timer = setTimeout(instance._onComplete, instance._delay);
        instance.emit('start', instance);
      }
    }
  };

  // stop the timer
  instance.stop = function() {
    if(instance._active) {
      instance._active = false;
      instance._paused = false;
      clearTimeout(instance._timer);
      instance.emit('stop', instance);
    }
  };

  // restart the timer
  instance.restart = function() {
    if(instance._active) {
      instance.stop();
    }
    instance.start();
    instance.emit('restart', instance);
  };

  // pause the timer
  instance.pause = function() {
    if(instance.isAlive()) {
      instance._paused = true;
      instance._delay -= (new Date() - instance._began);
      clearTimeout(instance._timer);
      instance.emit('pause', instance);
    }
  };

  // resume a paused timer
  instance.resume = function() {
    if(instance._paused) {
      instance._active = true;
      instance._paused = false;
      instance._began = new Date();
      instance._timer = setTimeout(instance._onComplete, instance._delay);

      instance.emit('start', instance);
      instance.emit('resume', instance);
    }
  };

  // forcefully make the timer expire
  instance.expire = function() {
    return _onComplete();
  };

  // clear the timer
  instance.clear = function() {
    return instance._invalidate();
  };

  instance._invalidate = function() {    
    clearTimeout(instance._timer);
    instance._reset();
  };

  instance.isStarted = function() {
    return instance._active;
  };

  instance.isStopped = function() {
    return !instance._active;
  };

  instance.isPaused = function() {
    return instance._paused;
  };

  instance.isAlive = function() {
    return (instance.isStarted() && !instance.isPaused());
  };

  // provide a default error for throwing when the timer expires
  Object.defineProperty(  instance,
                          'TimeoutException', {
    value: new Error('AsyncTimeout: Timeout'),
    writable: false,
    enumerable: true,
    configurable: true
  });

  // handy function because people are lazy and don't do triple-equals
  instance.isTimeoutException = function(err) {
    return (err === instance.TimeoutException);
  };

  instance.getDelay = function() {
    return instance._delay;
  };

  instance.setDelay = function(delay) {
    instance._config.delay = delay;
    instance._delay = delay;
  };

  // do a complete reset of internal state
  // only used on initialization & when a 
  // timer expires.
  instance._reset = function() {    
    instance._active = false;
    instance._timer = null;

    instance._paused = false;
    instance._began = null;

    instance._autostart = (typeof(instance._config.autostart) !== 'undefined' ? instance._config.autostart : true);
    instance._delay = (typeof(instance._config.delay) !== 'undefined' ? instance._config.delay : 1000);
  };

  instance._onComplete = function() {
    if(instance.isAlive()) {
      instance._reset();
      instance.emit('timeout', instance);
    }
  };

  instance._init();

};

util.inherits(AsyncTimeout, EventEmitter);
module.exports = AsyncTimeout;