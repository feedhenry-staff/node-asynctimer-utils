var lib = require(__dirname + '/../index.js');
var MonotonicDelayTimeout = lib.MonotonicDelayTimeout;

var debug = false;

var MonotonicDelayTimeoutTests = {

  setUp: function(done) {
    done();
  },

  tearDown: function(done) {
    done();
  },

  test1: function(test) {

    var delayTimeout = new MonotonicDelayTimeout({ delay: 1000, autostart: false });

    delayTimeout.on('start', function() {
      if(debug) {
        console.log('> start ' + this.getDelay() + 'ms');
      }
    });
    
    delayTimeout.on('stop', function() {
      if(debug) {
        console.log('> stop');
      }
    });
    
    delayTimeout.on('restart', function() {
      if(debug) {
        console.log('> restart');
      }
    });
    
    delayTimeout.on('pause', function() {
      if(debug) {
        console.log('> pause');
      }
    });
    
    delayTimeout.on('resume', function() {
      if(debug) {
        console.log('> resume');
      }
    });

    delayTimeout.on('timeout', function() {
      if(debug) {
        console.log('> timeout\n');
      }
    });
    
    delayTimeout.on('maxAttempts', function() {
      if(debug) {
        console.log('> maxAttempts');
      }
    });

    delayTimeout.start();

    setTimeout(function() {
      var num = delayTimeout.getAttemptIndex()+1;

      if(debug){
        console.log('Number of Attempts in 10s: ' + num);
      }
      
      delayTimeout.stop();

      test.equal(num, 5);
      test.done();

    }, 10000);

  },

};
module.exports = MonotonicDelayTimeoutTests;