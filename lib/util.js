module.exports.windowSort = (a, b) => {
  var ai = parseInt(a.window, 10);
  var bi = parseInt(b.window, 10);
  if(isNaN(ai)){
    ai = 10e6;
  }
  if(isNaN(bi)){
    bi = 10e6;
  }
  return ai - bi;
};

module.exports.dummyStats = {
  window: '600',
  windowPretty: '10m 0s',
  emitted: 0,
  transferred: 0,
  acked: 0,
  failed: 0,
  completeLatency: '0.000'
};
