'use strict';

var async = require('async');
var util = require('util');
var keyBy = require('lodash.keyby');

var extractCapacities = (topology) => {
  return keyBy(topology.bolts.map((b) => {
    return {
      boltId: b.boltId,
      capacity: b.capacity
    };
  }), 'boltId');
};

module.exports = (c, topologies) => {
  async.forEach(topologies, (t, done) => {
    async.waterfall([
      (cb) => {
        c.topology(t.id, (err, topology) => {
          topology.capacities = extractCapacities(topology);
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
