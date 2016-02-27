'use strict';

var async = require('async');
var statsd = require('./statsdLogger');

var decorate = (spout, client) => {
  spout.prefix = client.prefix;
  spout.tags = client.tags || {};
  spout.tags.topology = spout.name;
  return spout;
};

module.exports = (client, topology, cb) => {
  async.forEach(topology.spouts, (s, done) => {
    client.component(topology.id, s.spoutId, (err, spout) => {
      if(err){ return done(err); }
      statsd.spout(decorate(spout, client));
      done();
    });
  }, (err) => {
    cb(err, client, topology);
  });
};
