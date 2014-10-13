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
  var _config = config ? config : {};

  var _active = false;
  var _timer = null;
  var _paused = false;
  var _began = null;
  var _autostart = true;
  var _delay = 1000;

  var _init = function() {
    _reset();
    if(_autostart && !_active) {
      instance.start();
    }
  };

  var _onComplete = function() {
    if(instance.isAlive()) {
      var began = _began;
      _reset();
      instance.emit('timeout', instance);
    }
  };
  
  // do a complete reset of internal state
  // only used on initialization & when a 
  // timer expires.
  var _reset = function() {    
    _active = false;
    _timer = null;

    _paused = false;
    _began = null;

    _autostart = (typeof(_config.autostart) !== 'undefined' ? _config.autostart : true);
    _delay = (typeof(_config.delay) !== 'undefined' ? _config.delay : 1000);
  };

  var _invalidate = function() {    
    clearTimeout(_timer);
    _reset();
  };

  // start a timer (use with autostart set to false)
  instance.start = function() {
    if(!_active) {
      if(_paused) {
        instance.resume();
      } else {
        _active = true;
        _paused = false;
        _began = new Date();
        _timer = setTimeout(_onComplete, _delay);
        instance.emit('start', instance);
      }
    }
  };

  // stop the timer
  instance.stop = function() {
    if(_active) {
      _active = false;
      _paused = false;
      clearTimeout(_timer);
      instance.emit('stop', instance);
    }
  };

  // restart the timer
  instance.restart = function() {
    if(_active) {
      instance.stop();
    }
    instance.start();
    instance.emit('restart', instance);
  };

  // pause the timer
  instance.pause = function() {
    if(instance.isAlive()) {
      _paused = true;
      _delay -= (new Date() - _began);
      clearTimeout(_timer);
      instance.emit('pause', instance);
    }
  };

  // resume a paused timer
  instance.resume = function() {
    if(_paused) {
      _active = true;
      _paused = false;
      _began = new Date();
      _timer = setTimeout(_onComplete, _delay);
      instance.emit('resume', instance);
    }
  };

  // forcefully make the timer expire
  instance.expire = function() {
    return _onComplete();
  };

  // clear the timer
  instance.clear = function() {
    return _invalidate();
  };

  instance.isStarted = function() {
    return _active;
  };

  instance.isStopped = function() {
    return !_active;
  };

  instance.isPaused = function() {
    return _paused;
  };

  instance.isAlive = function() {
    return (instance.isStarted() && !instance.isPaused());
  };

  instance.getElapsedTime = function() {
    if(_began) {
      var now = new Date();
      return now - _began;
    } else {
      return 0;
    }
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
    return _delay;
  };

  instance.setDelay = function(delay) {
    _config.delay = delay;
    _delay = delay;
  };


  _init();

};

util.inherits(AsyncTimeout, EventEmitter);
module.exports = AsyncTimeout;