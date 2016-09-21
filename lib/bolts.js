'use strict';

var async = require('async');
var statsd = require('./statsdLogger');
var util = require('./util');

var decorate = (bolt, topology, client) => {
  bolt.prefix = client.prefix;
  bolt.tags = client.tags || {};
  bolt.tags.topology = bolt.name;

  // if the bolt hasn't started then the stats will be empty
  if(!bolt.boltStats || !bolt.boltStats[0]){
    bolt.boltStats = [util.dummyStats];
  }

  // the bolt info does give us a capacity value, but it is per-executor
  // so to get a single, nice stat, just use the one from the topology summary
  bolt.boltStats[0].capacity = topology.capacities[bolt.id].capacity;
  bolt.boltStats[0].executors = bolt.executors;
  bolt.boltStats[0].tasks = bolt.tasks;
  return bolt;
};

var sortStats = (boltStats) => {
  if(!boltStats[0]){
    return;
  }
  boltStats.sort(util.windowSort);
  return boltStats;
};

module.exports = (client, topology, cb) => {
  async.forEach(topology.bolts, (b, done) => {
    client.component(topology.id, b.boltId, (err, bolt) => {
      if(err){ return done(err); }
      bolt.boltStats = sortStats(bolt.boltStats);
      statsd.bolt(decorate(bolt, topology, client));
      done();
    });
  }, (err) => {
    cb(err, client, topology);
  });
};
