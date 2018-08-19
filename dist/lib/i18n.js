'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var i18n = function i18n(opts) {
    _classCallCheck(this, i18n);

    opts = Nesne.combine({
        langs: { tr: 'Türkçe' },
        map: null,
        rtl: ['ar', 'fa'],
        div: 'select'.prop({ onchange: function onchange() {
                this.dil = this.value;
            } }),
        model: function model(i) {
            return 'option'.attr('value', i).set(this[i]);
        },
        ranges: [1],
        scope: ''
    }, opts); //Ön tanımlı seçenekler
    var def = O.Disk._lang || opts.lang || navigator.language.substr(0, 2).toLowerCase();
    if (!opts[def]) {
        def = Object.keys(opts.langs)[0];
    }
    var l, t;
    if ((l = O.Disk._lTime) && (t = 'otag[i18n]'.get()).length) {
        t = t[0].attr('i18n'), t = t.indexOf(',') == -1 ? Number(t) : t.split(',').map(Number);
        var rem = [];
        opts.ranges.forEach(function (i, j) {
            if ((typeof l == 'number' ? l : l[j]) < (typeof t == 'number' ? t : t[j])) {
                rem = rem.concat(Object.keys(opts.langs).map(function (l) {
                    return '_l' + l + (j || '') + (opts.scope || '');
                }));
            }
        });
        O.Disk.rem(rem);
        console.log(rem);
    }
    opts.model = opts.model.bind(opts.langs);
    return O.i18n = opts.div.has(Object.keys(opts.langs).reduce(function (s, i) {
        s[i] = opts.model(i);
        return s;
    }, {})).prop({
        _: opts,
        onchange: function onchange() {
            this.dil = this.value;
        },
        get: function get(phrase) {
            var e = this;
            return new Promise(function (res, rej) {
                e.ready.then(function () {
                    var phr = Math.floor(phrase);
                    phrase = Math.round(phrase % 1 * 10);
                    if (e._.phr[phr]) {
                        res(e._.phr[phr].split('=')[phrase]);
                    } else {
                        rej();
                    }
                });
            });
        },
        refresh: function refresh() {
            '[phrase]'.get().map(O.F.each('Lang'));
        },
        ready: new Promise(function (res) {

            var i = setInterval(function () {
                var c = O.i18n._;
                if (c.r ? c.r == c.ranges.length : c.phr && Object.keys(c.phr).length) {
                    clearInterval(i);
                    res(1);
                    O.i18n.dil = c.lang;
                }
            }, 100);
        })
    }).resp({
        dil: function dil(_dil) {
            this.View[_dil].selected = true;
            O.Disk._lang = _dil;
            O.ready.then(function (b) {
                return b.Class('rtl', O.i18n._.rtl.indexOf(O.Disk._lang) == -1);
            });
            var e = this,
                c = e._,
                set = function set(res) {
                c.lang = _dil;
                O.Disk['_l' + c.lang + (this[1] || '') + e._.scope] = res;
                res = res.split('\n');
                if (e._.map) {
                    res = res.map(e._.map);
                }
                res.forEach(function (i, j) {
                    c.phr[j + this] = i;
                }, this[0] || 1);
                if (this[2] == 'net') {
                    var t = O.Disk._lTime || Array.from({ length: c.ranges.length }).map(function () {
                        return 0;
                    });
                    t[this[1]] = O.Time.now;
                    O.Disk._lTime = t;
                }
                c.r++;
                e.refresh();
            };
            e.refresh();
            c.phr = null;
            if (c.path) {
                var res;
                c.phr = {};
                (c.ranges || [1]).forEach(function (i, j) {
                    if (res = O.Disk['_l' + _dil + (j || '') + e._.scope]) {
                        set.call([i, j], res);
                    } else {
                        O.req(this.vars({ lang: _dil, part: j, scope: e._.scope })).then(set.bind([i, j, 'net']));
                    }
                }, c.path);
            } else {
                c.lang = _dil;
            }
            //this.View[this.dil].selected=false;
        } }).prop({ dil: def });
};

exports.default = i18n;