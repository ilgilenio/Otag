(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Uygu = factory());
}(this, (function () { 'use strict';

  let _selector = function(s) {
    let args = [];
    let attrRegex = /\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9,'.-_şŞüÜöÖçÇİığĞ#\(\):@ ]+)"\]/g;
    let attr = (s.match(attrRegex) || []).reduce((attr, i) => {
      s = s.replace(i, '');
      i = i.match(/([0-9A-Za-z.şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9,.-_şŞüÜöÖçÇİığĞ#\(\):@ ]+)/);
      attr[i[1]] = i[2];
      return attr
    }, {});
    if(s.indexOf(':') > -1) {
      args = s.split(':');
      s = args.shift();
    }
    var d = {
      class: /\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,
      id: /#([0-9A-Za-z\-_şŞüÜöÖçÇİığĞ]+)/,
      ui: /[$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,
      tag: /^[a-zşüöçığ][a-zşüöçığ0-9]*?$/g
    };
    d = Object.keys(d).reduce((o, i) => {
      var rm = [], e, x = -1, r = d[i];
      while((e = r.exec(s)) && r.lastIndex != x) {
        rm.push(e[0]);
        x = r.lastIndex;

        if(o[i] instanceof Array) {
          o[i].push(e[1]);
        }else{
          o[i] = e[1] || e[0];
          s = s.replace(e[0], '');
          break
        }
      }
      rm.forEach(i => {
        s = s.replace(i, '');
      });
      return o
    }, {class: [], id: '', ui: null, tag: null});
    d.args = args;
    d.attr = attr;
    if(s.length) {
      d.class = d.class.concat(s.split(' '));
    }
    return d
  };
  let proto = {
    Element: {
      destroy(after = 0, dur = 300) {
        return new Promise(res => {
          setTimeout(() => {
            setTimeout(() => { this.remove(); res(); }, dur);
            this.Class('destroy');
          }, after);
        })
      },
      disp(bool) {
        if(!bool && !this.hasOwnProperty('dispState')) {
          this.dispState = this.style.display;
        }
        this.style.display = bool ? this.dispState : 'none';
        return this
      },
      class(c) {
        if(typeof c == 'function') {
          this.class(c());
        }else{
          let list = {add: [], rem: []};
          Object.keys(c).forEach(f => {
            list[(typeof c[f] === 'function' ? c[f]() : c[f]) ? 'add' : 'rem'].push(f);
          });
          this.Class(list.rem, 0).Class(list.add);
        }
        return this
      },
      Class(name, r = true) {
        if(!(name instanceof Array)) {
          name = [name];
        }
        if(name[0] && name[0] != '') {
          this.className = name.reduce((a, b) => {
            a = a.replace(new RegExp('(\\b' + b + ')+'), '');
            return (r ? (a + ' ' + b) : a).replace(/\s{2}/g, ' ').trim()
          }, this.className);

          if(this.className.trim() == '') {
            this.removeAttribute('class');
          }
        }
        return this
      },
      do(method, on = 'click', args) {
        if(arguments[3]) {
          args = O$1.toArray(arguments).splice(2);
        }
        this['on' + on] = () => {
          this.parent[method].apply(this.parent, args || []);
        };
        return this
      },
      append(elems, reverse) {
        if(elems) {
          if(!(elems instanceof Array)) {
            elems = [elems];
          }
          if(reverse) {
            elems = elems.reverse();
          }

          elems.forEach(i => this.appendChild(i.el));
        }
        return this
      },
      set(str) {
        if(typeof (str) == 'string') {
          this.innerHTML = str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/"/g, '&quot;');
        }
        return this
      },
      pitch(e) {
        if(e.html) {
          this.innerHTML = Disk[e.html];
        }
        this.innerHTML = '';
        return e ? this.append.apply(this, arguments) : this
      }
    },
    String: {
      kur(otag = {}) {
        return new Sanal$$1(Object.assign(otag, {_el: this}))
      },
      get(index) {
        var th = O$1.toArray(document.querySelectorAll(this));

        if(this.indexOf('#') > -1) {
          index = 0;
        }
        if(index != null) {
          th = th[index];
        }
        return th
      },
      val(obj) {
        let r = this.split(',').map(i => { return obj.val[i] });
        return r.length == 1 ? r[0] : r
      },
      vars(vars) {
        vars = typeof vars == 'object' ? vars : arguments;
        return Object.keys(vars).reduce((m, v) => {
          return m.replace(new RegExp('(' + v + '[₺|$|₸|₼])+'), vars[v])
        }, this)
      },
      replaceAll(f, r) {
        let s = this;
        for(var i in f) {
          while(s.indexOf(f[i]) > -1) {
            s = s.replace(f[i], r[i]);
          }
        }
        return s
      },
      of(obj) {
        return this == '*' ? obj : this.split(',').reduce((o, i) => { o[i] = obj[i] || null; return o }, {})
      },
      from(obj) {
        let r = (this == '*' ? Object.keys(obj) : this.split(',')).map(i => obj[i]);
        return (this.indexOf(',') == -1 && this != '*') ? r[0] : r
      },
      obj(arr, def) {
        return this.split(',').reduce(
          def instanceof Array
            ? (n, i, j) => {
              n[i] = arr[j] || def[j];
              return n
            }
            : (n, i, j) => {
              n[i] = arr[j] || def;
              return n
            }
          , {})
      }
    },
    Function: {
      interval(time) {
        let interval, e = this;
        return {
          start() {
            this.stop();
            interval = setInterval.apply(null, [e, time].concat(arguments));
            return this
          },
          stop() {
            clearInterval(interval);
            return this
          }
        }
      },
      prom(bind) {
        let f = this.bind(bind);
        return function() {
          let a = arguments;
          return new Promise((res, rej) => {
            try{
              var r = f.apply(null, a);
              if(r.then) { r.then(res).catch(rej); }else(res(r));
            }catch(e) {
              rej(e);
            }
          })
        }
      },
      debounce(delay) {
        let f = this;
        let tOut;
        return function() {
          let a = arguments;
          clearTimeout(tOut);
          tOut = setTimeout(() => { f.apply(f, a); }, delay);
          return this
        }
      }
    },
    SVGElement: {
      set(src, height, width) {
        this.disp(0);
        O$1.req(src).then(i => {
          let tmp = (new DOMParser()).parseFromString(i, 'text/xml').children[0];
          O$1.toArray(tmp.attributes).forEach(attr =>
            this.setAttribute(attr.name, attr.value)
          );
          this.style.height = height;
          this.style.width = width;
          this.innerHTML = tmp.innerHTML;
          this.disp(1);
        });
        return this
      }
    },
    Image: {
      set(s, svg) {
        if(svg) {
          O$1.req(s).then(i => this.innerHTML = i);
          return this
        }
        this.loader = new Promise((res, rej) => {
          Object.assign(this, {
            onload() {
              this.Class('loading', 0);
              res();
            },
            onerror() {
              this.Class('loading', 0).Class('error'); rej();
            },
            src: s});
        });
        return this.Class('loading')
      }
    }
  };
  let props = {
    String: {
      to: {
        set(value) {
          this.el.to = value;
        }
      },
      el: {
        get() {
          let d = _selector(this + ''), el;
          if(d.ui) {
            if(!O$1.UI[d.ui]) { console.error(d.ui, 'is not defined'); }
            el = O$1.UI[d.ui].apply(d.ui, d.args);
          }else{
            el = d.tag == 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : document.createElement(d.tag || 'div');
            if(d.args.length) {
              el.set.apply(el, d.args);
            }
          }
          // Eğer kodunuz burada patlıyorsa, ₺Bileşen'i doğru oluşturmamışsınız demektir. ₺Bileşen Öge döndürmeli.
          Object.keys(d.attr).map(attr => el.setAttribute(attr, d.attr[attr]));
          if(d.id.length) {
            el.id = d.id;
          }
          if(d.class.length) {
            el.className = d.class.join(' ');
          }
          return el
        },
        set(v) {
          let el = this.el;

          ['click', 'load'].forEach(i => {
            delete v[i];
            if(v[i]) { el['on' + i] = v[i]; }
          });

          ['prop', 'has', 'layout', 'resp', 'set', 'attr', 'valid'].forEach(i => {
            if(v.hasOwnProperty()) {
              el[i](v[i]);
              delete v[i];
            }
          });
          if(v.to) {
            if(typeof v.to == 'string') {
              v.to.append(el);
            }else{
              el.to = v.to;
            }
            delete v.to;
          }
          Object.assign(el, v);
          return el
        }
      }
    },
    Element: {
      el: {
        get() { return this }
      },
      str: {
        get() {
          let ext = ['id', 'class'];
          let str = this.tagName != 'DIV' ? this.tagName.toLowerCase() : '';
          str += (this.id != '' ? '#' + this.id : '');
          str += O$1.toArray(this.classList).map(i => '.' + i)
            .join('');
          O$1.toArray(this.attributes).forEach((i) => {
            if(ext.indexOf(i.name) < 0) {
              i.value = i.value.replace('https:', '').replace('http:', '');
              str += '[' + i.name + '="' + i.value + '"]';
            }
          });
          return str
        }
      },
      to: {
        set(toElem) {
          if(typeof (toElem) == 'string') {
            O$1.ready.then(() => {
              toElem.get(0).pitch(this);
            });
          }else{
            if(toElem instanceof Sanal$$1) { toElem = toElem.el; }
            toElem.pitch(this);
          }
        }
      }
    },
    Function: {
      prevent: {
        get() {
          return e => {
            e.preventDefault();
            this(e);
          }
        }
      },
      stop: {
        get() {
          return e => {
            e.stopPropagation();
            this(e);
          }
        }
      },
      bounced: {
        get() {
          return this.debounce(100)
        }
      }
    },
    Image: {
      value: {
        get() {
          return this.src
        },
        set(src) {
          this.loader = new Promise((res, rej) => {
            this.prop({
              onload() { this.Class('loading', 0); res(); },
              onerror() { this.Class('loading', 0).Class('error'); rej(); },
              src});
          });
          this.Class('loading');
          return src
        }
      }
    }
  };

  (root => {
    Object.keys(proto).filter(i => root[i].prototype || root[i])
      .forEach(i => Object.assign(root[i].prototype || root[i], proto[i]));
    Object.keys(props).filter(i => root[i].prototype || root[i])
      .forEach(i => Object.defineProperties(root[i].prototype || root[i], props[i]));
    Object.keys(proto.Element).forEach(i => {
      root.Number.prototype[i] = root.String.prototype[i] = function() {
        let j = this.kur();
        return j[i].apply(j, arguments)
      };
    });
  })(window || global);

  let Time = new Proxy({
    interval() {
      let interval, args = arguments;
      return {
        start() {
          this.stop();
          interval = setInterval.apply(null, args);
          return this
        },
        stop() {
          clearInterval(interval);
          return this
        }
      }
    },
    rules: {
      yesterday: 864e5,
      today: 0,
      now: 0,
      tomorrow: -864e5
    }
  }, {
    get(o, k) {
      if(k == 'interval') { return o[k] }
      let t = new Date(+new Date() - o.rules[k]);
      if(k != 'now') {
        ['Hours', 'Minutes', 'Seconds'].map(i => t['set' + i](0));
      }
      return Math.floor(t.getTime() / 1000)
    }
  });

  class Sanal$$1 {
    constructor(o = {_el: ''}) {
      Object.assign(this, o);
      if(o.ƒ) {
        Object.defineProperties(this,
          Object.keys(o.ƒ).reduce((p, f) => {
            console.log(f);

            p[f] = {
              get: o.ƒ[f]
            };
            return p
          }, {}));
      }
      if(o.resp) {
        Object.defineProperties(this,
          Object.keys(o.resp).reduce((p, r) => {
            console.log(r);
            p[r] = {
              get: ()=>this['_'+r],
              set(v){
                o.resp[r](v);
                this['_'+r]=v;
              }
            };
            return p
          }, {}));
      }
      this.has(this.View);
    }
    V(path = '') {
      return path.split(':')
        .reduce((s, i) => s && s.View ? (i == '' ? s.View : s.View[i]) : null, this)
    }
    p(top) {
      let s = this;
      while(top--) {
        s = s.parent;
      }
      return s
    }
    do(method, event) {
      this.click = () => this.parent[method]();
      return this
    }
    has(View) {
      if(View) {
        Object.keys(View).forEach(i => {
          if(typeof View[i] == 'string') {
            View[i] = new Sanal$$1({_el: View[i],parent:this});
          } else if(!(View[i] instanceof Sanal$$1)) {
            View[i].parent=this;
            View[i] = new Sanal$$1(View[i]);
          }
        });
        this.View = View;
      }
      return this
    }
    append(e) {
      this.content = e;
      return this
    }
    set content(i) {
      this.$content = i;
      if(this._el && typeof this._el != 'string') {
        this._el.innerHTML = '';
        this._el.append(
          i.map(/*
            this.transition
            ?(i,j)=>{
              i.el.style.opacity=1
              return i.el.disp(0,null,this.transitionProperty).disp(1,j*10this.transition,this.transitionProperty)}
            : */i => i.el));
      }
    }
    get content() {
      return this.$content
    }
    set to(to) {
      this.el.to = to;
    }
    get valid() {
      if(this.validate) {
        if(typeof this.validate == 'function') {
          return this.validate(this.value)
        }else{
          let v;
          return !Object.keys(this.validate).some(i => {
            return (v = this.validate[i]) &&
              !(typeof v == 'function' ? v(this.View[i].value) : v.test(this.View[i].value))
          })
        }
      }
      return true
    }
    set value(o) {
      if(o instanceof Promise) {
        o.then(val => {
          this.value = val;
        });
      }
      if(this.bind) {
        let content = [];
        if(this.bind.before) {
          content.push(this.bind.before);
        }
        content = content.concat(Object.keys(o).map(i => {
          let obj = this.bind.model.el;
          obj.value = {key: i, value: o[i], _model: this.bind.model};
          return obj
        }));
        if(this.bind.after) {
          content.push(this.bind.after);
        }
        this.content = content;
      }else
      if(this.View) {
        if(o._model) { o = o.value; }
        Object.keys(o).forEach(i => {
          if(this.View[i]) {
            if(typeof this.View[i] == 'string') {
              this.View[i] = this.View[i].split(':').shift() + ':' + o[i];
            }else{
              this.View[i].value = o[i];
            }
          }
        });
      }else if(this.el.set) {
        this.el.set(o);
      }
      if(this.set) {
        this.set(o);
      }
    }
    get el() {
      if(typeof this._el == 'string') {
        this._el = this._el.el;
        this._el.sanal = this;
        if(this.template) {
          this.layout = this.template;
        }else if(this.content) {
          this._el.append(this.content);
        }else if(this.View) {
          this._el.append(O$1.toArray(this.View));
        }
        if(typeof this.bind == 'string') {
          this.bind = {model: this.bind};
        }
        if(this.fetch) {
          let data;
          if(this.fetch.save && (data = Disk[this.fetch.save])) {
            this.value = data;
          }else{
            O$1.req(this.fetch.from).then(r => {
              if(this.fetch.shape) {
                r = this.fetch.shape(r);
              }
              this.value = r;
              if(this.fetch.save) {
                Disk[this.fetch.save] = r;
              }
            });
          }
        }
        ['click', 'load', 'select'].filter(i => this[i]).forEach(i => this._el['on' + i] = this[i]);
      }
      return this._el
    }
    set layout(t) {
      this.el.innerHTML = '';
      let ln, gir, gir2, dis, last = this.el, branch = last, V = this.View;
      t = t.split('\n').forEach((line) => {
        dis = line.trim();

        if(ln = dis.length) {
          gir2 = (line.length - ln) / 2;
          if(V && V[dis]) { dis = V[dis].el; }else if(dis[0] == ':') {
            if(last instanceof Text && gir == gir2) {
              last.data += '<br>' + dis.substring(1).trimLeft();
              return
            }
            dis = document.createTextNode(dis.substring(1).trimLeft());
          }else{
            dis = dis.el;
          }

          if(gir != null) {
            if(gir2 != gir) {
              branch = gir2 > gir ? last : branch.p;
            }
          }
          branch.appendChild(dis);
          last = dis;
          dis.p = branch;
          gir = gir2;
        }
      });
    }
  }

  var none = {
    _el: 'Bulunamadı',
    name: 'Bulunamadı',
    template: `
    center
      h1:Bet Bulunamadı
      p:Aradığınız bet bulunamadı`
  };

  class Page$$1 {
    constructor(opts = {}) {
      opts = Object.assign({
        routes: {},
        none,
        handler: 'body'
      }, opts);

      opts.routes.none = opts.none;
      this.handler = opts.handler;
      let route = this.routes = opts.routes;
      Object.keys(route).filter(r => typeof (route[r]) != 'string')
        .map(r => {
          if(!(route[r] instanceof Sanal$$1)) {
            route[r] = new Sanal$$1(route[r]);
          }
          if(!route[r].name) {
            route[r].name = r;
          }
          route[r]._name = route[r].name;
          Object.defineProperty(route[r], 'name', {
            get: () => {
              return route[r]._name
            },
            set: (name) => {
              this.title(name);
              this.Nav.value = {[r]: name};
              route[r]._name = name;
            }
          });
          return route[r]
        });
      O$1.ready.then(() => {
        this.route();
        window.onpopstate = this.route.bind(this);
      });
    }
    title(title) {
      if(this._title) {
        title = this._title.vars({title});
      }
      document.title = title;
    }
    route(hash) {
      let push = 0;
      if(!hash) {
        hash = decodeURI(location.hash);
      }
      if(hash instanceof Object && !(hash instanceof Array)) {
        push = hash.type && hash.type == 'pushstate';
        hash = hash.state || decodeURI(location.hash);
      }
      var h = hash.split('/');
      if(h[0] == '#') { h.shift(); }

      if(h[0] == '' && this.routes.index) {
        return this.route('index')
      }
      let r, page = h.shift();
      if(!(r = this.routes[page])) {
        page = 'none';
        r = this.routes.none;
      }
      if(typeof r == 'string') { return this.route(r) }
      if(typeof r == 'function') { r.apply(null, h); }
      if(r instanceof Sanal$$1) {
        let pageChanged = this.page != page;
        this.page = page;
        if(this.handler) {
          let handle = r => {
            if(this.handler.handle) {
              this.handler.handle(r, pageChanged);
            }else if(pageChanged) {
              this.handler.pitch(r);
            }
          };
          if(typeof this.handler == 'function') {
            this.handler(r);
          }else if(typeof this.handler == 'string') {
            r.to = this.handler;
          }else{
            handle(r);
          }
        }
        if(r.once) {
          r.once.apply(r, h);
          delete r.once;
        }else
        if(r.wake) { r.wake.apply(r, h); }
      }
      if(!push) {
        window.history[(push ? 'push' : 'replace') + 'State'](hash, null, hash.indexOf('#') == -1 ? '#/' + hash : hash);
      }
    }
    Navigation(opts = {}) {
      opts = Object.assign({
        hide: []
      }, opts);

      opts.hide.push('none');
      let el = this.Nav = 'Nav'.kur({
        View: Object.keys(this.routes).filter(i => (typeof (this.routes[i]) != 'string') && (opts.hide.indexOf(i) == -1))
          .reduce((o, i) => { o[i] = 'a[href="/#/' + i + '"]'; return o }, {})
      });
      el.value = Object.keys(el.View).reduce((o, i) => { o[i] = this.routes[i].name; return o }, {});
      return el
    }
    set page(page) {
      if(this._page != page) {
        this.now = this.routes[page];
        this._page = page;
      }
    }
    get page() {
      return this._page
    }
    set now(now) {
      // Önceki Beti atıl duruma sok
      if(this.now && this.now.idle) {
        this.now.idle();
      }
      let {name} = now;
      this.title(name);
      this._now = now;
    }
    get now() {
      return this._now
    }
  }

  var Tor = {
    Sock,
    req
  };

  function Sock(opts) {
    opts = Object.assign({
      url: null, // websocket host
      q: {}, // query object
      interval: 3000 // yeniden bağlanma 3s
    }, typeof opts == 'string' ? {url: opts} : (opts || {}));

    opts.q = Object.assign(opts.q, opts.socketio ? {
      transport: 'polling',
      EIO: 3
    } : {_osid: O._uid(16)});

    opts.url = opts.url || window.location.origin; // başarımı artırmak için öntanımlı opts nesnesinde değil
    if(opts.socketio) { opts.url += 'socket.io/'; }
    let r = /((ws|http)s?):\/\//g.exec(opts.url);
    if(r) {
      r = r[1];
      if(r.substr(0, 4) == 'http') {
        opts.url = (r.length > 4 ? 'wss://' : 'ws://') + opts.url.split('://')[1];
      }
    }else{
      opts.url = 'wss://' + opts.url;
    }
    opts.url += '?' + _queryString(opts.q);
    let on = {}, socket, interval, conn;
    conn = {
      on(topic, f) {
        if(topic instanceof Object) {
          Object.keys(topic).forEach(t => {
            on[t] = topic[t];
          });
        }else{
          on[topic] = f;
        }
        return this
      },
      connect() {
        if(!this.connected) {
          socket = Object.assign(
            new WebSocket(opts.url + '&_tstamp=' + O.Time.now), {
              onopen(e) {
                interval.stop();
                this.connected = 1;
                if(on.open) {
                  on.open(e.data);
                }
              },

              lib: this,
              onmessage(e) {
                e = e.data;
                let offset = e.indexOf(','), topic = e.substr(0, offset);
                if(on[topic]) {
                  on[topic](JSON.parse(e.substring(offset + 1)), this);
                }
              },
              onclose(e) {
                if(e.type == 'error' && on.error) {
                  on.error(e);
                }
                console.log('error', e);
                this.lib.connected = 0;
                interval.start();
              }
            });
          socket.onerror = socket.onclose;
        }
        return this
      },
      emit(topic, message) {
        socket.send(topic + ',' + JSON.stringify(message));
      }
    };
    interval = O.interval(conn.connect, opts.interval).start();
    return conn.connect()
  }

  function req(endpoint = '', data, method) {
    var XHR = new XMLHttpRequest();
    endpoint = endpoint.indexOf('//') > -1 ? endpoint : (typeof this != 'string' ? './ep₺' : this).vars({ep: endpoint});

    XHR.open(method ? method.toUpperCase() : (data ? 'POST' : 'GET'), endpoint, true);
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    return new Promise(function(res, rej) {
      XHR.onreadystatechange = function() {
        if(this.readyState == 4) {
          if(this.status == 200) {
            if(this.response != '') {
              var r;
              try{
                r = JSON.parse(this.response);
              }catch(e) {
                r = this.response;
              }
              res(r);
            }else{ rej({error: 'empty response'}); }
          }else{
            rej({error: {code: this.status}});
          }
        }
      };
      XHR.send(data ? O._queryString(data) : '');
    })
  }

  let _queryString = obj => {
    let pr = arguments[1];
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = pr ? pr + '[' + p + ']' : p, v = obj[p];
        str.push(typeof v == 'object' ? _queryString(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
    }
    return str.join('&')
  };

  let Disk = new Proxy({
    expire: function(key, time) {
      Disk[key + ':expire'] = Math.floor(+new Date() / 1000) + Number(time);
    },
    rem: k => {
      if(typeof k == 'string') { k = [k]; }
      k.forEach(i => {
        localStorage.removeItem(i);
      });
    }
  }, {
    get: (o, k) => {
      if(o[k]) { return o[k] }
      let e;
      if(e = localStorage.getItem(k + ':expire')) {
        if(Number(e) < Math.floor(+new Date() / 1000)) {
          delete Disk[k];
          return null
        }
      }
      k = localStorage.getItem(k);
      try{
        return JSON.parse(k)
      } catch(Exception) {
        return k
      }
    },
    set: (o, k, v) => {
      localStorage.setItem(k, JSON.stringify(v));
      return true
    },
    deleteProperty: (o, k) => {
      localStorage.removeItem(k);
      return true
    },
    has: (o, k) => {
      return !!localStorage[k]
    }
  });

  let O$1 = {
    require(js, path = '') {
      return Tor.req(path + js + '.js').then(code => {
        let module = {};
        eval(code);
        return module.exports
      })
    },
    define(cls, methods) {
      if(!this[cls]) {
        this[cls] = {};
      }
      Object.keys(methods).forEach((i) => {
        this[cls][i] = methods[i];
      });
    },
    UI: {
      M() {
        let a = O$1.toArray(arguments);
        return O$1.Model[a.shift()].apply('', a)
      }
    },
    req: Tor.req,
    Model: {},
    toArray: o => Object.keys(o).map(i => o[i]),
    ready: new Promise((res) => {
      document.addEventListener('DOMContentLoaded', () => {
        let {body, head} = document;
        res({body, head});
      });
    })
  };

  let Kabuk = 'Kabuk'.kur({
    View: {
      yönlendir: 'Yönlendir'.kur({
        View: {
          imlek: 'img:./img/o.min.svg',
          dizelge: ''
        },
        template: `
        a[href="./#/ana"]
          imlek
        dizelge
      `
      }),
      taşıyıcı: 'Taşıyıcı'
    }
  });

  let routes = {
    index: 'ana',
    ana: 'Ana Bet'.kur({
      View: {
        img: 'img:./img/otag.svg',
        açıklama: '.desc:Otağ\'a Hoşgeldiniz'
      },
    	once() {
    		this.V('img').el.loader.then(() => this.V('açıklama').el.Class('açık'));
    	},
    	name: 'Ana Bet'
    }),
    hakkında: 'Hakkında Bet'.kur({
      View: {
        açıklama: '.açıklama'
      },
    	once() {
    		this.V('açıklama').value = 'Otağ MIT yetergesiyle yayımlanan bir JS Çatısıdır';
        this.V('açıklama').el.Class('açıklama');
    	},
    	name: 'Hakkında'
    })
  };

  let Uygulama = new Page$$1({routes, handler: Kabuk.V('taşıyıcı').el});
  Uygulama.Navigation({hide: ['ana']}).to = Kabuk.V('yönlendir:dizelge').el;
  Kabuk.to = 'body';

  // Sınama İçin
  Uygulama.O = O$1;

  return Uygulama;

})));
