'use strict';

var async = require('async');
var statsd = require('./statsdLogger');

var decorate = (bolt, client) => {
  bolt.prefix = client.prefix;
  bolt.tags = client.tags || {};
  bolt.tags.topology = bolt.name;
  return bolt;
};

module.exports = (client, topology, cb) => {
  async.forEach(topology.bolts, (b, done) => {
    client.component(topology.id, b.boltId, (err, bolt) => {
      if(err){ return done(err); }
      statsd.bolt(decorate(bolt, client));
      done();
    });
  }, (err) => {
    cb(err, client, topology);
  });
};
