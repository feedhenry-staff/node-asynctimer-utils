var lib = require(__dirname + '/../index.js');
var MonotonicDelayTimeout = lib.MonotonicDelayTimeout;

var MonotonicDelayTimeoutTests = {

  setUp: function(done) {
    done();
  },

  tearDown: function(done) {
    done();
  },

  test1: function(test) {

    var delayTimeout = new MonotonicDelayTimeout();

    delayTimeout.on('start', function() {
      console.log('> start ' + this.getDelay() + 'ms');
    });
    
    delayTimeout.on('stop', function() {
      console.log('> stop');
    });
    
    delayTimeout.on('restart', function() {
      console.log('> restart');
    });
    
    delayTimeout.on('pause', function() {
      console.log('> pause');
    });
    
    delayTimeout.on('resume', function() {
      console.log('> resume');
    });
    
    delayTimeout.on('timeout', function() {
      console.log('> timeout\n');
    });
    
    delayTimeout.on('maxAttempts', function() {
      console.log('> maxAttempts');
    });


    delayTimeout.start();


    test.ok(1);
    test.done();
  },

};
module.exports = MonotonicDelayTimeoutTests;