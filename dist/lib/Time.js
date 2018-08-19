'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = new Proxy({
  yesterday: 864e5,
  today: 0, now: 0,
  tomorrow: -864e5
}, { get: function get(a, b, c) {
    var t = new Date(+new Date() - a[b]);
    if (b != 'now') {
      t.setHours(0);
      t.setMinutes(0);
      t.setSeconds(0);
    };return Math.floor(t.getTime() / 1000);
  } });