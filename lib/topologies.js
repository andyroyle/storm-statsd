'use strict';

var async = require('async');
var util = require('util');

module.exports = (c, topologies) => {
  async.forEach(topologies, (t, done) => {
    async.waterfall([
      (cb) => {
        c.topology(t.id, (err, topology) => {
          cb(err, c, topology);
        });
      },
      require('./spouts'),
      require('./bolts')
    ], done);
  }, (err) => {
    if(err){
      util.log(`[${c.host}] ${err}`);
    }
  });
};
