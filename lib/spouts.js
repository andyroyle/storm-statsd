'use strict';

var async = require('async');
var statsd = require('./statsdLogger');
var util = require('./util');

var decorate = (spout, client) => {
  spout.prefix = client.prefix;
  spout.tags = client.tags || {};
  spout.tags.topology = spout.name;

  // if the spout hasn't started then the stats will be empty
  if(!spout.spoutSummary[0]){
    spout.spoutSummary = [util.dummyStats];
  }

  return spout;
};

var sortStats = (stats) => {
  if(!stats[0]){
    return;
  }
  stats.sort(util.windowSort);
  return stats;
};

module.exports = (client, topology, cb) => {
  async.forEach(topology.spouts, (s, done) => {
    client.component(topology.id, s.spoutId, (err, spout) => {
      if(err){ return done(err); }
      spout.spoutSummary = sortStats(spout.spoutSummary);
      statsd.spout(decorate(spout, client));
      done();
    });
  }, (err) => {
    cb(err, client, topology);
  });
};
