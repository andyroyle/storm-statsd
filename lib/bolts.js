'use strict';

var async = require('async');
var statsd = require('./statsdLogger');

var decorate = (bolt, topology, client) => {
  bolt.prefix = client.prefix;
  bolt.tags = client.tags || {};
  bolt.tags.topology = bolt.name;
  // the bolt info does give us a capacity value, but it is per-executor
  // so to get a single, nice stat, just use the one from the topology summary
  bolt.boltStats[0].capacity = topology.capacities[bolt.boltId];
  return bolt;
};

module.exports = (client, topology, cb) => {
  async.forEach(topology.bolts, (b, done) => {
    client.component(topology.id, b.boltId, (err, bolt) => {
      if(err){ return done(err); }
      statsd.bolt(decorate(bolt, topology, client));
      done();
    });
  }, (err) => {
    cb(err, client, topology);
  });
};
