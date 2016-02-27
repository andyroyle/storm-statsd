'use strict';

var gauges = require('./gauges');
var StatsD = require('statsd-client');
var path = require('path');
var configDir = path.resolve(process.argv[2] || './');
var statsConfig = require(path.join(configDir, 'statsd'));
var util = require('util');

var statsdClient = new StatsD({
  host: statsConfig.host,
  port: statsConfig.port,
  prefix: statsConfig.prefix,
  debug: statsConfig.debug || false
});

var buildTags = (tags) => {
  return Object.keys(tags || {})
    .map((k, v) => {
      return `${k}=${tags[k]}`;
    }).join(',');
};

var logComponent = (c, type, tags) => {
  var prop = 'boltStats';
  if(type === 'spout'){
    prop = 'spoutSummary';
  }
  var id = c.id.toLowerCase();

  gauges.map((f) => {
    var prefix = '';

    if(c.prefix && c.prefix.length > 0){
      prefix = `${c.prefix}.`;
    }

    var suffix = '';
    if(tags && Object.keys(tags).length > 0){
      suffix = `,${buildTags(tags)}`;
    }

    return [
      `${prefix}${type}s.${id}.${f}${suffix}`,
      c[prop][0][f] || 0
    ];
  }).forEach((f) => {
    statsdClient.gauge(f[0], f[1]);
  });
};

module.exports = {
  bolt: (bolt) => {
    logComponent(bolt, 'bolt', bolt.tags);
  },
  spout: (spout) => {
    logComponent(spout, 'spout', spout.tags);
  }
};
