var EventEmitter = require("events").EventEmitter;

function TimeMonitor() {
 
  var instance = this;
  instance._start = null;
  instance._end = null;
  instance._timeTaken = null;
 
  instance.start = function() {
    instance._start = new Date();
    instance.emit('start');
    return instance;
  }
 
  instance.stop = function() {
    instance._end = new Date();
    instance._timeTaken = instance._end - instance._start;
    instance.emit('stop');
    return instance;
  }
 
  instance.timeTaken = function() {
    return instance._timeTaken;
  }
 
}

util.inherits(TimeMonitor, EventEmitter);
module.exports = TimeMonitor;