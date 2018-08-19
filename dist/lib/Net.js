'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.req = exports.Sock = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _nesne = require('nesne');

var _nesne2 = _interopRequireDefault(_nesne);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Net = function Net() {
    _classCallCheck(this, Net);

    this.req = req;
    this.Sock = Sock;
    //this.fetch=fetch
};

exports.default = Net;

var Sock = exports.Sock = function Sock(opts) {
    _classCallCheck(this, Sock);

    opts = _nesne2.default.combine({
        url: null, // websocket host
        q: {}, // query object
        interval: 3000 // yeniden bağlanma 3s
    }, typeof opts == 'string' ? { url: opts } : opts || {});

    opts.q = _nesne2.default.combine(opts.q, opts.socketio ? {

        transport: 'polling',
        EIO: 3
    } : { _osid: _uid(16) });

    opts.url = opts.url || window.location.origin; // başarımı artırmak için öntanımlı opts nesnesinde değil
    if (opts.socketio) {
        opts.url += 'socket.io/';
    }
    var r = /((ws|http)s?):\/\//g.exec(opts.url);
    if (r) {
        r = r[1];
        if (r.substr(0, 4) == 'http') {
            opts.url = (r.length > 4 ? 'wss://' : 'ws://') + opts.url.split('://')[1];
        }
    } else {
        opts.url = 'wss://' + opts.url;
    }
    opts.url += '?' + _queryString(opts.q);
    var _on = {},
        socket = void 0,
        interval = void 0,
        conn = void 0;
    conn = {
        on: function on(topic, f) {
            if (topic instanceof Object) {
                Object.keys(topic).forEach(function (t) {
                    _on[t] = topic[t];
                });
            } else {
                _on[topic] = f;
            }
            return this;
        },
        connect: function connect() {
            if (!this.connected) {
                socket = new WebSocket(opts.url + '&_tstamp=' + O.Time.now);
                socket.onopen = function (e) {
                    interval.stop();
                    if (_on.open) {
                        _on.open(e.data);
                    }
                };
                this.connected = 1;
                socket.lib = this;
                socket.onmessage = function (e) {
                    e = e.data;
                    var offset = e.indexOf(','),
                        topic = e.substr(0, offset);
                    if (_on[topic]) {
                        _on[topic](JSON.parse(e.substring(offset + 1)), this);
                    }
                };
                socket.onerror = socket.onclose = function (e) {
                    if (e.type == 'error' && _on.error) {
                        _on.error(e);
                    }
                    console.log('error', e);
                    this.lib.connected = 0;
                    interval.start();
                };
            }
            return this;
        },
        emit: function emit(topic, message) {
            socket.send(topic + ',' + JSON.stringify(message));
        }
    };
    interval = O.interval(conn.connect, opts.interval).start();
    return conn.connect();
};

var req = exports.req = function req(ep, data) {
    _classCallCheck(this, req);

    var XHR = new XMLHttpRequest();

    //backend+endpoint
    XHR.open(data ? 'POST' : 'GET', ep.indexOf('/') > -1 ? ep : O._conf.req.ep.vars({ ep: ep }), true);
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    return new Promise(function (res, rej) {
        XHR.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (this.response != '') {
                        var r;
                        try {
                            r = JSON.parse(this.response);
                        } catch (e) {
                            r = this.response;
                        }
                        res(r);
                    } else {
                        rej({ error: 'empty response' });
                    }
                } else {
                    rej({ error: { code: this.status } });
                }
            }
        };
        XHR.send(data ? _queryString(data) : '');
    });
};

var _queryString = function _queryString(obj) {
    var pr = arguments[1];
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = pr ? pr + '[' + p + ']' : p,
                v = obj[p];
            str.push((typeof v === 'undefined' ? 'undefined' : _typeof(v)) == 'object' ? _queryString(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
    }
    return str.join('&');
};

var _uid = function _uid(len) {
    len = len || 6;
    var str = '',
        rnd = void 0;
    while (len--) {
        //A-Z 65-90
        //a-z 97-122
        rnd = Math.floor(Math.random(1e10) * 1e5 % 52);
        str += String.fromCharCode(rnd + (rnd < 26 ? 65 : 71));
    }
    return str;
};