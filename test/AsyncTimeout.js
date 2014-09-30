var lib = require(__dirname + '/../index.js');
var AsyncTimeout = lib.AsyncTimeout;

var AsyncTimeoutTests = {

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
module.exports = AsyncTimeoutTests;