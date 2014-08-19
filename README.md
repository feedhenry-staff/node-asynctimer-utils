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

## Use case

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
        res.end('> Timeout has expired!');
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