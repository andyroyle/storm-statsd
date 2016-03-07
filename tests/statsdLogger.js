var proxyquire = require('proxyquire').noCallThru();
var should = require('should');
var statsdLogger;

describe('statsdLogger tests', () => {
  var metrics = [];

  function Client() {}
  Client.prototype.gauge = (m, v) => {
    metrics.push({ m: m, v: v });
  };

  beforeEach(() => {
    metrics = [];
    statsdLogger = proxyquire('../lib/statsdLogger', {
      'statsd': {
        host: 'foo'
      },
      'statsd-client': Client,
      './gauges': [ 'foo', 'bar' ],
      path: {
        resolve: (a) => { return a },
        join: (a, b) => { return b }
      }
    });
  });

  describe('logging a bolt', () => {
    it('should log all the given fields', () => {
      statsdLogger.bolt({
        id: 'foo-bolt',
        boltStats: [
          {
            foo: 1,
            bar: 2
          }
        ]
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('bolts.foo-bolt.foo');
      metrics[0].v.should.equal(1);
      metrics[1].m.should.equal('bolts.foo-bolt.bar');
      metrics[1].v.should.equal(2);
    });

    it('should log missing fields as zero', () => {
      statsdLogger.bolt({
        id: 'foo-bolt',
        boltStats: [{}]
      });
      metrics.length.should.equal(2);
      metrics.forEach(function(f){
        f.v.should.equal(0);
      });
    });

    it('should append given tags', () => {
      statsdLogger.bolt({
        id: 'foo-bolt',
        boltStats: [{
          'foo': 1,
          'bar': 2
        }],
        tags: {
          'foo': 'bar',
          'flarg': 'baz'
        }
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('bolts.foo-bolt.foo,foo=bar,flarg=baz');
      metrics[1].m.should.equal('bolts.foo-bolt.bar,foo=bar,flarg=baz');
    });

    it('should use instance prefix', () => {
      statsdLogger.bolt({
        id: 'foo-bolt',
        prefix: 'boo',
        boltStats: [{
          'foo': 1,
          'bar': 2
        }]
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('boo.bolts.foo-bolt.foo');
      metrics[1].m.should.equal('boo.bolts.foo-bolt.bar');
    });

    it('should include the topology name as a tag', () => {
      statsdLogger.bolt({
        id: 'foo-bolt',
        boltStats: [{
          'foo': 1,
          'bar': 2
        }],
        tags: {
          topology: 'foo'
        }
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('bolts.foo-bolt.foo,topology=foo');
      metrics[1].m.should.equal('bolts.foo-bolt.bar,topology=foo');
    });
  });

  describe('logging a spout', () => {
    it('should log all the given fields', () => {
      statsdLogger.spout({
        id: 'foo-spout',
        spoutSummary: [
          {
            foo: 1,
            bar: 2
          }
        ]
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('spouts.foo-spout.foo');
      metrics[0].v.should.equal(1);
      metrics[1].m.should.equal('spouts.foo-spout.bar');
      metrics[1].v.should.equal(2);
    });

    it('should log missing fields as zero', () => {
      statsdLogger.spout({
        id: 'foo-spout',
        spoutSummary: [{}]
      });
      metrics.length.should.equal(2);
      metrics.forEach(function(f){
        f.v.should.equal(0);
      });
    });

    it('should append given tags', () => {
      statsdLogger.spout({
        id: 'foo-spout',
        spoutSummary: [{
          'foo': 1,
          'bar': 2
        }],
        tags: {
          'foo': 'bar',
          'flarg': 'baz'
        }
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('spouts.foo-spout.foo,foo=bar,flarg=baz');
      metrics[1].m.should.equal('spouts.foo-spout.bar,foo=bar,flarg=baz');
    });

    it('should use instance prefix', () => {
      statsdLogger.spout({
        id: 'foo-spout',
        prefix: 'boo',
        spoutSummary: [{
          'foo': 1,
          'bar': 2
        }]
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('boo.spouts.foo-spout.foo');
      metrics[1].m.should.equal('boo.spouts.foo-spout.bar');
    });

    it('should include the topology name as a tag', () => {
      statsdLogger.spout({
        id: 'foo-spout',
        spoutSummary: [{
          'foo': 1,
          'bar': 2
        }],
        tags: {
          topology: 'foo'
        }
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('spouts.foo-spout.foo,topology=foo');
      metrics[1].m.should.equal('spouts.foo-spout.bar,topology=foo');
    });
  });
});
