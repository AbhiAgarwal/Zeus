require('coffee-script');
var putt_lib = require('./lib/putt');
module.exports = function(config) {
  return new putt_lib.Putt(config); 
};
