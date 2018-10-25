(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Uygu = factory());
}(this, (function () { 'use strict';

  let now = () => Math.floor(+new Date() / 1000);
  let Disk = new Proxy({
    expire: new Proxy({}, {
      set(o, k, v) {
        k = Disk.ƒscope ? (Disk.ƒscope + '_' + k) : k;
        localStorage.setItem(k + ':expire', now() + Number(v));
        return true
      }
    }),
    rem: k => {
      if(typeof k == 'string') { k = [k]; }
      if(typeof Disk.ƒscope == 'string') {
        k = k.map(i => Disk.ƒscope + '_' + i);
      }
      k.forEach(i => {
        localStorage.removeItem(i);
      });
    }
  }, {
    get: (o, k) => {
      if(o[k]) { return o[k] }
      let e;
      k = o.ƒscope ? o.ƒscope + '_' + k : k;
      if(e = localStorage.getItem(k + ':expire')) {
        if(Number(e) < now()) {
          localStorage.removeItem(k);
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
      if(k == 'ƒscope') {
        o.ƒscope = v;
        return true
      }
      k = o.ƒscope ? o.ƒscope + '_' + k : k;

      localStorage.setItem(k, JSON.stringify(v));
      return true
    },
    deleteProperty: (o, k) => {
      k = o.ƒscope ? o.ƒscope + '_' + k : k;

      localStorage.removeItem(k);
      return true
    },
    has: (o, k) => {
      k = o.ƒscope ? o.ƒscope + '_' + k : k;

      return !!localStorage[k]
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
            p[r] = {
              get: () => this['_' + r],
              set(v) {
                o.resp[r](v);
                this['_' + r] = v;
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
            if(View[i][0] == '₺') {
              View[i] = View[i].el;
            }else{
              View[i] = new Sanal$$1({_el: View[i], parent: this});
            }
          }
          if(!(View[i] instanceof Sanal$$1)) {
            View[i].parent = this;
            View[i] = new Sanal$$1(View[i]);
          }else{
            View[i].parent = this;
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
        return
      }
      if(this.bind) {
        let content = [];
        if(this.bind.before) {
          content.push(this.bind.before);
        }
        content = content.concat(Object.keys(o).map(i => {
          let obj = this.bind.model.el;
          if(obj.source) { obj.oid = o[i]; }else{
            obj.value = {key: i, value: o[i], _model: this.bind.model};
          }
          return obj
        }));
        if(this.bind.after) {
          content.push(this.bind.after);
        }
        this.content = content;
      }else
      if(this.View) {
        if(o._model) { o = o.value; }
        let k = Object.keys(o);
        k.forEach(i => {
          if(this.View[i]) {
            if(typeof this.View[i] == 'string') {
              this.View[i] = this.View[i].split(':').shift() + ':' + o[i];
            }else{
              this.View[i].value = o[i];
            }
          }
        });
        // for hidden calculated values
        Object.keys(this.View)
          .filter(v => k.indexOf(v) == -1)
          .forEach(i => {
            if(i in o) {
              this.View[i].value = o[i];
            }
          });
      }else if(this.el.set) {
        this.el.set(o);
      }
      if(this.set) {
        this.set(o);
      }
      if(this.change) {
        this.change();
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
          this._el.append(
            Object
              .keys(this.View)
              .map(i => this.View[i])
          );
        }
        if(typeof this.bind == 'string') {
          this.bind = {model: this.bind};
        }
        let oid = 'NULLOID';
        if(this.source) {
          if('oid' in this) { oid = this.oid; }
          Object.defineProperty(this, 'oid', {
            get: () => this._oid,
            set: (oid) => {
              (this._oid = oid);
              this.value = this.source[oid];
            }
          });
        }
        if(this.fetch) {
          this.fetcher = this.fetch;
        }
        ['click', 'load', 'select'].filter(i => this[i]).forEach(i => this._el['on' + i] = this[i]);
        if(this.enter) {
          this._el.addEventListener('keyup', (e => { if(e.keyCode == 13) { this[this.enter](e.target.value); } }).prevent.stop);
        }
        if(oid != 'NULLOID') {
          this.oid = oid;
        }
      }
      return this._el
    }
    set fetcher(f) {
      clearInterval(this._fetchInterval);
      let fetch = () => {
        O$1.req(f.from).then(r => {
          if(f.shape) {
            r = f.shape(r);
          }
          this.value = r;
          if(f.save) {
            Disk[f.save] = r;
            if(f.expire) {
              Disk.expire[f.save] = f.expire;
            }
          }
        });
      };
      let data;
      if(f.save && (data = Disk[f.save])) {
        this.value = data;
      }else{
        fetch();
      }
      if(f.refresh) {
        this._fetchInterval = setInterval(fetch, f.refresh * 1e3);
      }
    }
    set layout(t) {
      this.el.innerHTML = '';
      let ln, gir, gir2, dis, last = this.el, branch = last, V = this.View;
      t = t.split('\n').forEach((line) => {
        dis = line.trim();

        if(ln = dis.length) {
          gir2 = (line.length - ln) / 2;
          if(V && this.V(dis)) { dis = this.V(dis).el; } else
          if(dis[0] == ':') {
            if(last instanceof Text && gir == gir2) {
              branch.appendChild(document.createElement('br'));
              /* last.data += '<br>' + dis.substring(1).trimLeft()
              return */
            }
            dis = document.createTextNode(dis.substring(1).trimLeft());
          }else{
            dis = dis.el;
            let ev = ['click', 'select', 'focus', 'select'];
            [...dis.attributes].forEach(i => {
              if(ev.indexOf(i.name) > -1) {
                dis['on' + i.name] = (e => this[i.value](e)).stop.prevent;
              }else
              if(i.name == 'enter') {
                dis.addEventListener('keyup', (e => { console.log(e, e.keyCode); if(e.keyCode == 13) { this[i.value](e.target.value); } }).prevent.stop);
              }
            });
          }

          if(gir != null) {
            if(gir2 != gir) {
              branch = last;
              for(let i = gir2 - 1; i < gir; i++) {
                branch = branch.p;
              }
            }
          }
          if(dis instanceof Sanal$$1) {
            dis = dis.el;
          }
          branch.appendChild(dis);
          last = dis;
          dis.p = branch;
          gir = gir2;
        }
      });
    }
  }

  let _selector = s => {
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
          args = [...arguments].splice(2);
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
          str = str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;');
          this.innerHTML = str;
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
          start(...args) {
            this.stop();
            interval = setInterval.apply(null, [e, time].concat(args));
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
        return (...args) => {
          return new Promise((res, rej) => {
            try{
              var r = f.apply(null, args);
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
        return function(...args) {
          clearTimeout(tOut);
          tOut = setTimeout(() => { f.apply(f, args); }, delay);
          return this
        }
      }
    },
    SVGElement: {
      set(src, height, width) {
        this.disp(0);
        O$1.req(src).then(i => {
          let tmp = (new DOMParser()).parseFromString(i, 'text/xml').children[0];
          [...tmp.attributes].forEach(attr =>
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
              this
                .Class('loading', 0)
                .Class('error');
              rej();
            },
            src: s});
        });
        return this.Class('loading')
      }
    }
  };
  let props = {
    String: {
      get: {
        get() {
          var nodes = [...document.querySelectorAll(this)];

          if(this.indexOf('#') > -1) {
            nodes = nodes[0];
          }
          return nodes
        }
      },
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
      sanal: {
        get() { return this._sanal },
        set(sanal) {
          let enter = this.getAttribute('enter');
          if(enter) {
            this.addEventListener('keyup', (e => { if(e.keyCode == 13) { sanal.parent[enter](this.value); } }).prevent.stop);
          }
          if(this.innerHTML.indexOf('₺') > -1) {
            this.innerHTML = this.innerHTML.vars(sanal);
          }
          this._sanal = sanal;
        }
      },
      el: {
        get() { return this }
      },
      str: {
        get() {
          let ext = ['id', 'class'];
          let str = this.tagName != 'DIV' ? this.tagName.toLowerCase() : '';
          str += (this.id != '' ? '#' + this.id : '');
          str += [...this.classList].map(i => '.' + i)
            .join('')
          ;[...this.attributes].forEach((i) => {
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
              let elm = toElem.get;
              elm = (elm instanceof Array ? elm[0] : elm);
              if(!elm) {
                console.error('"seçici₺" ile belgede öge bulunamadı'.vars({seçici: toElem}));
                return 0
              }
              elm.pitch(this);
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
      root.Number.prototype[i] = root.String.prototype[i] = function(...args) {
        let j = this.kur();
        return j[i].apply(j, args)
      };
    });
  })(window || global);

  let Time = new Proxy({
    interval(...args) {
      let interval;
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

  var none = {
    _el: 'Bulunamadı',
    name: 'Bulunamadı',
    template: `
    center
      h1:Bet Bulunamadı
      p:Aradığınız bet bulunamadı`
  };

  class Page {
    constructor(opts = {}) {
      opts = Object.assign({
        routes: {},
        none,
        handler: 'body'
      }, opts);

      opts.routes.none = opts.none;
      this.handler = opts.handler;
      this.title = opts.title;
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
              this.setTitle(name);
              this.Nav.value = {[r]: name};
              route[r]._name = name;
            }
          });
          return route[r]
        });

      this.route();
      window.onpopstate = this.route.bind(this);
    }
    setTitle(title) {
      this._titleInfo = title = title || this._titleInfo;
      document.title = this.title;
    }
    get title() {
      return (this._title || 'title₺').vars({title: this._titleInfo})
    }
    set title(title) {
      this._title = title;
      this.setTitle(title);
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
        if(this.change) {
          this.change(page, h, pageChanged, !!r.once);
        }
        this.page = page;
        if(this.handler) {
          if(typeof this.handler == 'function') {
            this.handler(r);
          }else if(typeof this.handler == 'string') {
            r.to = this.handler;
          }else if(this.handler.handle) {
            this.handler.handle(r, pageChanged);
          }else{
            r.to = this.handler;
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
          .reduce((o, i) => { o[i] = 'a[href="/#/' + i + '"][title="' + this.routes[i].name + '"]:' + this.routes[i].name; return o }, {})
      });
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
      this.setTitle(name);
      this._now = now;
    }
    get now() {
      return this._now
    }
    set to(handler) {
      this.handler = handler;
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
      XHR.send(data ? _queryString(data) : '');
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
      Object.keys(methods).forEach(i => this[cls][i] = methods[i]);
    },
    calc: (obj, features) => {
      Object.defineProperties(
        obj,
        Object
          .keys(features)
          .reduce((o, f) => {
            o[f] = {
              get: features[f].bind(obj),
              set: (v) => console.error(f, 'için değer ataması yapılamaz.')
            };
            return o
          }, {})
      );
      return obj
    },
    UI: {
      M: (...args) => O$1.Model[args.shift()].apply('', args)
    },
    req: Tor.req,
    Model: {},
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

  let Uygulama = new Page({routes, handler: Kabuk.V('taşıyıcı').el});
  Uygulama.Navigation({hide: ['ana']}).to = Kabuk.V('yönlendir:dizelge').el;
  Kabuk.to = 'body';

  // Sınama İçin
  Uygulama.O = O$1;

  return Uygulama;

})));
