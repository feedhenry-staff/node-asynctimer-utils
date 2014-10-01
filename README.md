# Introduction

AsyncTimeout is a wrapper module around the setTimeout function. It enables you to do a few common things with a timeout including: start, stop, pause, resume, restart.

All events are emitted in typical Node.js fashion with events for each of the above. 

For example:
``` javascript
var timer = new AsyncTimer({ delay: 10000 });
timer.on('timeout', function() {
  console.log('The timeout expired!');
})
```

## AsyncTimeout

A typical use case for this is when doing multiple tasks in parallel which may require a timeout, such as processing data or communicating with an external database - typically something which has a potential for taking longer than is appropriate to make a user wait for.

For example:
``` javascript
var timeout;
async.series([

    // Setup the timeout
    function(next) {

      timeout = new AsyncTimeout({ delay: 10000 });
      timeout.on('timeout', function() {
        console.log('> Timeout has expired!');
      });

      next();
    },

    // Do something
    function(next) {
      if(timeout.isAlive()) { // make sure to test that the timer is still alive
        // ... do something here ... //
      }
    }

]);
```

Additionally, you can have the timer continue indefinitely similar to setInterval like so:
``` javascript
timeout = new AsyncTimeout({ delay: 100 });
timeout.on('timeout', function(scope) {
  console.log('> Timeout has expired!');
  res.end('> Timeout has expired!');
  scope.restart();
});
```

### Events
  * start
  * stop
  * restart
  * pause
  * resume
  * timeout


## MonotonicDelayTimeout

An asynchronous timeout object, which will monotonically increase the delay time each time the timeout is called. You can even overload the monotonicCalculator method to provide your own logic for how the delay changes with time.

For example:
``` javascript
timeout = new MonotonicDelayTimeout({ delay: 1000, maxAttempts: 10 });
timeout.on('timeout', function() {
  console.log('> Timeout has expired!');
});

timeout.on('maxAttempts', function() {
  console.log('> Timeout reached the maximum attempts!');
});
```

By default the delay is increased by 150% each time the timeout is called.

### Events
  * start
  * stop
  * restart
  * pause
  * resume
  * maxAttempts

## TimeMonitor

Calculates duration between starting and stopping; A very bare-bones object, but provides a handy utility if you want to know how long it took for operation(s) to complete.

For example:
``` javascript
var monitor = new TimeoutMonitor();
monitor.start();

// do something that takes time
setTimeout(function() {
  // thinking
}, (Math.random() * 5000) + 1000);

monitor.stop();
console.log(monitor.timeTaken());
```

### Events
  * start
  * stop