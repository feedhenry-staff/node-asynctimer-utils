var lib = require(__dirname + '/../index.js');
var TimeMonitor = lib.TimeMonitor;

var TimeMonitorTests = {

  setUp: function(done) {
    done();
  },

  tearDown: function(done) {
    done();
  },

  test1: function(test) {
    test.ok(1);
    test.done();
  },

};
module.exports = TimeMonitorTests;