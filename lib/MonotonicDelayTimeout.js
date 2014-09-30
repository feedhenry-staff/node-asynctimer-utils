var EventEmitter = require("events").EventEmitter;
var util = require('util');
var AsyncTimeout = require(__dirname + '/AsyncTimeout.js');

function MonotonicDelayTimeout(config) {

/* 
  TODO: 

*/

  var instance = this;
  instance._config = config ? config : {};

  instance._attempts = 0;
  instance._maxDelay = 30000;
  instance._maxAttempts = -1;

  instance._listeners = {
    start: function() {
      instance.emit('start');
    },
    stop: function() {
      instance.emit('stop');
    },
    restart: function() {
      instance.emit('restart');
    },
    pause: function() {
      instance.emit('pause');
    }, 
    resume: function() {
      instance.emit('resume');
    },
    timeout: function() {

      instance.emit('timeout');

      instance._attempts++;
      if(instance._maxAttempts > 0 && instance._attempts >= instance._maxAttempts) {
        instance.emit('maxAttempts');
      } else {
        var delay = instance.monotonicCalculator.call(instance);
        instance._timer.setDelay(delay);
        instance._timer.restart();
      }

    }
  };

  // overload this to do your own logic 
  instance.monotonicCalculator = function() {

    var delay = this.getDelay() * 1.5;
    delay = delay >= this.getMaxDelay ? this.getMaxDelay : delay;
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
    instance._timer.restart();
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

  instance.getMaxDelay = function() {
    return instance._maxDelay;
  };

  instance.getMaxAttempts = function() {
    return instance._maxAttempts;
  };

  instance.getAttempts = function() {
    return instance._attempts;
  };


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