var EventEmitter = require("events").EventEmitter;
var util = require('util');
var AsyncTimeout = require(__dirname + '/AsyncTimeout.js');

function MonotonicDelayTimeout(config) {

  var instance = this;
  instance._config = config ? config : {};

  instance._attempts = 0;
  instance._maxDelay = 30000;
  instance._maxAttempts = -1;

  if(!instance._config.hasOwnProperty('delay')) {
    instance._config.delay = 1000;
  }
  instance._initialDelay = instance._config.delay;

  instance._listeners = {

    start: function() {
      instance.emit('start', instance);
    },
    stop: function() {
      instance.emit('stop', instance);
    },
    restart: function() {
      instance.emit('restart', instance);
    },
    pause: function() {
      instance.emit('pause', instance);
    }, 
    resume: function() {
      instance.emit('resume', instance);
    },
    timeout: function() {

      instance.emit('timeout', instance);

      instance._attempts++;
      if(instance._maxAttempts > 0 && instance._attempts >= instance._maxAttempts) {
        instance.emit('maxAttempts', instance);
      } else {
        var delay = instance.monotonicCalculator.call(instance);
        delay = delay >= instance.getMaxDelay ? instance.getMaxDelay : delay;
        instance._timer.setDelay(delay);
        instance._timer.restart();
      }

    }
  };

  // overload this to do your own logic 
  instance.monotonicCalculator = function() {

    var delay = Math.round(this.getDelay() * 1.5);
    return delay;

  };

  instance._timer = new AsyncTimeout(instance._config);

  instance._timer.on('start',     instance._listeners.start);
  instance._timer.on('stop',      instance._listeners.stop);
  instance._timer.on('restart',   instance._listeners.restart);
  instance._timer.on('pause',     instance._listeners.pause);
  instance._timer.on('resume',    instance._listeners.resume);
  instance._timer.on('timeout',   instance._listeners.timeout);

  instance._init = function() {
    instance._reset();
  };

  // start a timer (use with autostart set to false)
  instance.start = function() {
    instance._timer.start();
  };

  // stop the timer
  instance.stop = function() {
    instance._timer.stop();
  };

  // restart the timer
  instance.restart = function() {
    instance._attempts = 0;
    instance._timer.setDelay(instance._initialDelay);
    instance._timer.restart();
  };

  // clear the timer
  instance.clear = function() {
    instance._reset();
  };

  // pause the timer
  instance.pause = function() {
    instance._timer.pause();
  };

  // resume a paused timer
  instance.resume = function() {
    instance._timer.resume();
  };

  // forcefully make the timer expire
  instance.expire = function() {
    return instance._timer.expire();
  };

  instance.isStarted = function() {
    return instance._timer.isStarted();
  };

  instance.isStopped = function() {
    return instance._timer.isStopped();
  };

  instance.isPaused = function() {
    return instance._timer.isPaused();
  };

  instance.isAlive = function() {
    return instance._timer.isAlive();
  };

  instance.getDelay = function() {
    return instance._timer.getDelay();
  };

  instance.setDelay = function(delay) {
    instance._initialDelay = delay;
    instance._timer.setDelay(delay);
  };

  instance.getMaxDelay = function() {
    return instance._maxDelay;
  };

  instance.getMaxAttempts = function() {
    return instance._maxAttempts;
  };

  instance.getAttemptIndex = function() {
    return instance._attempts;
  };

  instance.getElapsedTime = function() {
   return instance._timer.getElapsedTime();
  }


  // do a complete reset of internal state
  // only used on initialization & when a 
  // timer expires.
  instance._reset = function() {    

    instance._timer.clear();

    instance._attempts = 0;
    instance._maxDelay = instance._config.maxDelay ? instance._config.maxDelay : 30000;         
    instance._maxAttempts = instance._config.maxAttempts ? instance._config.maxAttempts : -1;   // set to -1 for infinite retries

  };

  instance._init();

};

util.inherits(MonotonicDelayTimeout, EventEmitter);
module.exports = MonotonicDelayTimeout;