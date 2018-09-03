/*    _             _
  o  | |        o  | |                o
 _   |/   __,  _   |/   __  _  __    _    __
  |  |   /  | / |  |   |_/ / |/  |  / |  /  \
  |_/|__/\_/|/  |_/|__/|__/  |   |_/  |_/\__/
           /|
*          \|   2016-2018 ilgilenio® 
*               Otag Çatı Çalışması 1.3.4
*               https://gitlab.com/ilgilenio/Otag/wikis
*               MIT ile dagitilmaktadir
*/
'use strict'
var O, Otag = O = {
  include(js, path) {
    return new Promise(res => {
      O.ready.then(() => {
        document.head.append('script'.attr('src', (path || '') + js + '.js').prop({onload() {
          res(js)
        }}))
      })
    })
  },
  
  require(js, path) {
    return new Promise(res => {
      O.ready.then(() => {
        O.req((path || '') + js + '.js').then(code => {
          let module = {}, window = undefined
          eval(code)
          res(module.exports)
        })
      })
    })
  },

  interval(){
    let interval, args = arguments
    return {
      start(){
        this.stop()
        interval = setInterval.apply(null, args)
        return this
      },
      stop(){
        clearInterval(interval)
        return this
      }
    }
  },
  
  Page(opts){
    opts = Object.assign({
      routes: {},
      Nav: true,
      hide: [],
      none: 'Bulunamadı'.prop({
        name: 'Bulunamadı'
      }).layout([
        ['center', [
          'h1'.set('Bet Bulunamadı'),
          'p'.set('Aradığınız bet bulunamadı')
        ]]
      ]),
      handler(Oge){
        document.body.html(Oge)
      }
    }, opts || {})
    opts.hide.push('none')
    opts.routes.none = opts.none
    Element.prototype.router = function(r){
      return this.resp('route', function(route){
        if(this.route){
          delete  O.Page.routes[this.route]
        }
        O.Page.routes[route] = this
      }).prop('route', r)
    }
    Element.prototype.to = function(page, args){
      this.onclick = (e=>O.Page.to[page].apply(1, args)).prevent.stop
    }
    O.Page = O.resp.call({
      to: new Proxy({}, {
        get(o, k){
          return function(){
            if(this){
              let args = O.toArray(arguments)
              return ()=>{
                O.Page.routeSilent(k, (args.concat(O.toArray(arguments))))
              }}
            O.Page.routeSilent(k, O.toArray(arguments))
          }
        }
      }),
      routes: new Proxy({}, {
        set(o, k, v){
          o[k] = v
          if(opts.Nav && v instanceof Element && (opts.hide.indexOf(k) < 0)){
            O.Page.Nav.append('a'.link(k, '#/' + k).set(v.name))

          }
          return true
        },
        get(o, k){
          return o[k] ? o[k] : null
        }
      }),
      routeSilent(page, args, push){
        if(page == '' && this.routes.index){
          return this.routeSilent('index', args)
        }
        let r
        if(!(r = this.routes[page])){
          r = this.none
        }
        if(typeof r == 'string'){return this.routeSilent(r, args)}
        if(typeof r == 'function'){r.apply(null, args)}
        if(r instanceof Element){
          this.now = r
          if(opts.handler){
            let handle = r => {
              if(opts.handler.handle){
                opts.handler.handle(r)
              }else{
                opts.handler.html(r)
              }
            }
            if(typeof opts.handler == 'function'){
              opts.handler(r)

            }else if(typeof opts.handler == 'string'){
              O.ready.then(()=>(opts.handler = opts.handler.get()) && handle(r))
            }else{
              handle(r)
            }
          }
          if(r.once){
            r.once.apply(r, args)
            delete r.once
          }else
          if(r.wake){r.wake.apply(r, args)}
        }
        window.history[(push ? 'push' : 'replace') + 'State'](page, null, '#/' + page)
      },

      route(hash, push){
        /* 
          if(hash instanceof Object){
          hash=hash.state||'';
        }
        if(opts.resolver){
          opts.resolver(hash).then(this.routeComplete);
        }*/
        if(hash instanceof Object && !(hash instanceof Array)){
          hash = hash.state || ''
        }
        var h = hash.split('/')
        if(hash instanceof Array){
          h = hash
          hash = hash.join('/')
        }else{
          h = hash.split('/')
          if(h[0] == '#'){h.shift()}
        }
        if(h[0] == '' && this.routes.index){
          return this.route('index')
        }
        let r
        if(!(r = this.routes[h.shift()])){
          r = this.none
        }
        if(typeof r == 'string'){return this.route(r)}
        if(typeof r == 'function'){r.apply(null, h)}
        if(r instanceof Element){
          this.now = r
          if(opts.handler){
            let handle = r=> {
              if(opts.handler.handle){
                opts.handler.handle(r)
              }else{
                opts.handler.html(r)
              }
            }
            if(typeof opts.handler == 'function'){
              opts.handler(r)

            }else if(typeof opts.handler == 'string'){
              O.ready.then(()=>(opts.handler = opts.handler.get()) && handle(r))
            }else{
              handle(r)
            }
          }
          if(r.once){
            r.once.apply(r, h)
            delete r.once
          }else
          if(r.wake){r.wake.apply(r, h)}
        }
        window.history[(push ? 'push' : 'replace') + 'State'](hash, null, '#/' + hash)
      }
    }, {now(now){
      // Önceki Beti atıl duruma sok
      if(this.now && this.now.idle){
        this.now.idle()
      }
      let name = now.name
      if(isFinite(name) && typeof O.i18n != 'function'){
        let s = this.title
        name = O.i18n.get(name).then(name => {
          s.set({page: name || ''})
        })
      }else{
        this.title.set({page: name || ''})
      }
      
    }})
    if(opts.Nav){
      O.Page.Nav = opts.Nav == true ? 'Nav'.init() : opts.Nav
    }
    Object.keys(opts.routes).forEach(v =>{
      O.Page.routes[v] = opts.routes[v]
    })
    let init = function(){
      var title
      if(!(title = 'title'.get()).length){
        document.head.append(title = ['title'.init()])
      }
      if(title[0].innerHTML.indexOf('page₺') == -1){
        title[0].set('page₺')
      }
      
      this.title = title[0]
      this.route(decodeURI(location.hash.substring(2)), 1)
      window.onpopstate = this.route.bind(this)
    }
    O.ready.then(init.bind(O.Page))
    return O.Page
  },
  
  Disklet(url, data, diskPrefix, fields, expire){
    if(url instanceof Object){
      expire = fields || 300
      fields = diskPrefix
      diskPrefix = data
      data = null
      let Src = {_ready: -1, sum(keys){
        let s = this
        return Object.keys(s).reduce((n, i) => {
          if(i != 'sum' && i != '_ready'){
            n[i] = keys.of(s[i])
          }
          return n
        }, {})
      }}
      let ready = function(){
        return new Promise(function(res){
          if(O.Disk[diskPrefix]){
            Src._ready = 1
            Object.assign(Src, O.Disk[diskPrefix])
            Src.sum = Src.sum.bind(Src)
            res(Src)
          }else if(Src._ready == -1){
            O.req(url.static).then(function(data){
              if(fields != '*'){
                data = Object.keys(data).reduce((o, i)=>{
                  o[i] = fields.from(data[i])
                })
              }
              Src._ready = 1
              Object.assign(Src, O.Disk[diskPrefix])
              Src.sum = Src.sum.bind(Src)
              O.Disk.expire(diskPrefix, expire)
              res(Src)
            })
          }
        })
      }
      if(url.when == 'init'){
        ready()
      }
      return new Proxy(Src, {
        get(o, k){
          return new Promise(res=>{
            if(o._ready == 1){
              res(o[k])
            }else{
              ready().then(Src=>{
                o = Src
                res(o[k])
              })
            }
          })
        }
      })
    }else{
      return new Proxy(O.Disk, {
        get(o, k){
          return new Promise(res=>{
            let key = (diskPrefix || '') + k
            if(o[key]){
              res(o[key])
            }else{
              if(data && data.id){
                data.id = k
              }
              O.req(url.vars({id: k}), data).then(r=>{
                res(o[key] = fields.of(r))
                if(expire){
                  O.Disk.expire(key, expire)
                }
              })
            }
          })
        }
      })
    }
  },

  Socklet(Sock, channel, data){
    let Ref = {}, Store = []
    Sock.on(channel, d=>{
      Object.keys(d).forEach(i=>{
        if(Ref[i]){
          while(Ref[i].length){
            Ref[i].pop()(d[i])
          }
          delete Ref[i]
        }else{
          Store.filter(s=>{
            return s[0][s[1]] == i
          }).forEach(s=>{
            s[0].val = d[i]  
          })
        }
      })
    })
    //combine data if set
    let cmb = data ? d => Object.assign(Object.create(data), d) : d=>d
    return new Proxy({
      _conn(Elem, on){
        Store.push([Elem, on])
      },
      set(n){
        Sock.emit(channel, cmb({set: n}))
      }
    }, {
      get(o, k){
        if(o[k]){
          return o[k]
        }
        return new Promise(res=>{
          if(!Ref[k]){
            Ref[k] = []
          }
          Ref[k].push(res)
          Sock.emit(channel, cmb({get: k}))
        })
      },
      set(o, k, v){
        o.set({[k]: v})
      },
      deleteProperty(o, k){
        Sock.emit(channel, cmb({rem: k}))
      }
    })
  },
  
  Chain(f){
    var obj = this || null
    return ()=>{
      let args = arguments
      obj = this || obj
      return new Promise((res, rej)=>{
        var prom = f.shift().prom().apply(obj, args), i
        while(i = f.shift()){
          prom = prom.then(i).catch(rej)
        }
        prom.then(res).catch(rej)

      })
    }
  },

  resp(prop, f){
    if(typeof prop == 'string'){
      prop = {[prop]: f}
    }
    let e = this || {}
    Object.defineProperties(e, Object.keys(prop).reduce(function(s, p){
      var fx = prop[p];let fOld = 0
      // Bu özellikte daha önceden tanımlanmış bir duyar var mı
      if(e.__lookupGetter__(p)){
        fOld = e.__lookupGetter__(p)(1)
        if(typeof fOld == 'function'){fOld = [fOld]}
        //Eski duyarla yeni duyarı birleştir.
        fx = fOld.concat(fx)
      }else{
        if(e[p] != undefined){e['_' + p] = e[p]}
      }
      if(!fOld){
        s[p] = {
          get(f){
            return f ? fx : this['_' + p]
          },
          set(val){
            if(val != this[p]){
              // Tek bir duyar mı var yoksa birden fazla mı duyar eklenmiş?
              if(typeof fx == 'function'){
                fx.call(this, val)
              }else{
                fx.forEach(function(i){
                  i.call(this, val)
                }, this)
              }
              this['_' + p] = val
              
            }
          }
        }
      }
      return s
    }, {}))
    return e
  },
  
  stor(prop, storekey){
    if(typeof prop == 'string'){
      prop = {[prop]: storekey}
    }
    return Object.keys(prop).reduce((e, p)=>{
      var store = prop[p], v
      e = O.resp.call(e, p, val=>{
        O.Disk[store] = val
      })
      if((v = O.Disk[store]) != null){
        e[p] = v
        e.__lookupSetter__(p).call(e, e[p], 1)
      }else if(e[p] != undefined){
        e.__lookupSetter__(p).call(e, e[p], 1)
      }
      return e
    }, this || {})
  },
  
  ready: new Promise(res => {
    document.addEventListener('DOMContentLoaded', () => res(document.body))
  }),

  _selector(s){
    let args = []
    if(s.indexOf(':')>-1){
      args = s.split(':')
      s = args.shift()
    }
    var d = {
      attr: /\[(,?[ ]?([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9.-_şŞüÜöÖçÇİığĞ]+)")+\]/g,
      class: /\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,
      id: /#([0-9A-Za-z\-_şŞüÜöÖçÇİığĞ]+)/,
      ui: /[$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,
      tag: /^[a-zşüöçığ][a-zşüöçığ0-9]*?$/g  //tag
    }
    d = Object.keys(d).reduce(function(o, i){
      var rm = [], e, x = -1, r = d[i]
      while((e = r.exec(s)) && r.lastIndex != x){
        rm.push(e[0])
        x = r.lastIndex
        if(o[i] instanceof Object && !(o[i] instanceof Array)){
          debugger
          o[i][e[2]] = e[3]
        }else{
          if(o[i] == null){
            o[i] = e[1] || e[0]
            s = s.replace(e[0], '')
            break
          }
          o[i].push(e[1])
        }
      }
      rm.forEach(i=>{
        s = s.replace(i, '')
      })
      return o
    }, {class: [], attr: {}, id: null, ui: null, tag: null})
    d.args = args
    if(s.length){
      d.class = d.class.concat(s.split(' '))
    }
    return d
  },
  
  define(cls, methods){
    if(!this[cls]){
      this[cls] = {}
    }
    Object.keys(methods).forEach(i=>{
      this[cls][i] = methods[i]
    })
  },

  _conf: {
    req: {ep: '/ep₺'},
  },
  
  Time: new Proxy({
    yesterday: 864e5,
    today: 0, now: 0,
    tomorrow: -864e5
  }, {get(a, b){
    let t = new Date(+new Date - a[b])
    if(b != 'now'){
      t.setHours(0)
      t.setMinutes(0)
      t.setSeconds(0)
    }return Math.floor(t.getTime() / 1000)}}),
  
  Disk: new Proxy({
    expire(key, time){
      O.Disk[key + ':expire'] = O.Time.now + Number(time)
    },
    rem(k){
      if(typeof k == 'string'){k = [k]}
      k.forEach(i=>localStorage.removeItem(i))
    }
  }, {
    get(o, k){
      if(o[k]){return o[k]}
      let e = localStorage.getItem(k + ':expire')
      if(e){
        if(Number(e) < O.Time.now){
          delete O.Disk[k]
          return null
        }
      }
      k = localStorage.getItem(k)
      try{
        return JSON.parse(k)
      }
      catch(Exception){
        return k
      }
    }
    , set(o, k, v){
      localStorage.setItem(k, JSON.stringify(v))
      return true
    }

    , deleteProperty(o, k){
      return delete localStorage[k]
    }
    , has(o, k){
      return localStorage[k] ? true : false
    }
  }),
  
  Sock(opts){
    opts = Object.assign({
      url: null,       // websocket host
      q: {},          // query object
      interval: 3000 // yeniden bağlanma 3s
    }, typeof opts == 'string' ? {url: opts} : (opts || {}))

    opts.q = Object.assign(opts.q, opts.socketio ? {

      transport: 'polling',
      EIO: 3
    } : {_osid: O._uid(16)})


    opts.url = opts.url || window.location.origin // başarımı artırmak için öntanımlı opts nesnesinde değil
    if(opts.socketio){opts.url += 'socket.io/'}
    let r = /((ws|http)s?):\/\//g.exec(opts.url)
    if(r){
      r = r[1]
      if(r.substr(0, 4) == 'http'){
        opts.url = (r.length > 4 ? 'wss://' : 'ws://') + opts.url.split('://')[1]
      }
    }else{
      opts.url = 'wss://' + opts.url
    }
    opts.url += '?' + O._queryString(opts.q)
    let on = {}, socket, interval, conn
    conn = {
      on(topic, f){
        if(topic instanceof Object){
          Object.keys(topic).forEach(t=>{
            on[t] = topic[t]
          })
        }else{
          on[topic] = f
        }
        return this
      },
      connect(){
        if(!this.connected){
          socket = new WebSocket(opts.url + '&_tstamp=' + O.Time.now)
          socket.onopen = function(e){
            interval.stop()
            this.connected = 1
            if(on.open){
              on.open(e.data)
            }
          }
          
          socket.lib = this
          socket.onmessage = function(e){
            e = e.data
            let offset = e.indexOf(','), topic = e.substr(0, offset)
            if(on[topic]){
              on[topic](JSON.parse(e.substring(offset + 1)), this)
            }
          }
          socket.onerror = socket.onclose = function(e){
            if(e.type == 'error' && on.error){
              on.error(e)
            }
            console.log('error', e)
            this.lib.connected = 0
            interval.start()
          }
        }
        return this
      },
      emit(topic, message){
        socket.send(topic + ',' + JSON.stringify(message))
      }
    }
    interval = O.interval(conn.connect, opts.interval).start()
    return conn.connect()
  },

  req(ep, data){
    var XHR = new XMLHttpRequest()
    
    //backend+endpoint
    XHR.open(data ? 'POST' : 'GET', ep.indexOf('/') > -1 ? ep : (O._conf.req.ep.vars({ep: ep})), true)
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    return new Promise(function(res, rej){
      XHR.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            if(this.response != ''){
              var r
              try{
                r = JSON.parse(this.response)
              }catch(e){
                r = this.response
              }
              res(r)
            }else{rej({error: 'empty response'})}
          }else{
            rej({error: {code: this.status}})
          }
        }
      }
      XHR.send(data ? O._queryString(data) : '')
    })     
  },

  _queryString(obj){
    let pr = arguments[1]
    var str = []
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = pr ? pr + '[' + p + ']' : p, v = obj[p]
        str.push(typeof v == 'object' ? O._queryString(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v))
      }
    }
    return str.join('&')
  },

  _uid(len){
    len = len || 6
    let str = '', rnd
    while(len--){
      //A-Z 65-90
      //a-z 97-122
      rnd = Math.floor((Math.random(1e10) * 1e5) % 52)
      str += String.fromCharCode(rnd + (rnd < 26 ? 65 : 71))
    }
    return str
  },

  i18n(opts){
    opts = Object.assign({
      langs: {tr: 'Türkçe'},
      map: null,
      rtl: ['ar', 'fa'],
      div: 'select'.prop({onchange(){this.dil = this.value}}),
      model(i){
        return 'option'.attr('value', i).set(this[i])
      },
      ranges: [1],
      scope: ''
    }, opts) //Ön tanımlı seçenekler
    var def = O.Disk._lang || opts.lang || navigator.language.substr(0, 2).toLowerCase()
    if(!opts[def]){
      def = Object.keys(opts.langs)[0]
    }
    var l, t
    if((l = O.Disk._lTime) && (t = 'otag[i18n]'.get()).length){
      t = t[0].attr('i18n'),
      t = t.indexOf(',') == -1 ? Number(t) : t.split(',').map(Number)
      var rem = []
      opts.ranges.forEach((i, j)=>{
        if((typeof l == 'number' ? l : l[j]) < (typeof t == 'number' ? t : t[j])){
          rem = rem.concat(Object.keys(opts.langs).map(l=> '_l' + l + (j || '') + (opts.scope || '')))
        }
      })
      O.Disk.rem(rem)
      console.log(rem)
    }
    opts.model = opts.model.bind(opts.langs)
    return O.i18n = opts.div
      .has(
        Object.keys(opts.langs).reduce((s, i)=>{
          s[i] = opts.model(i)
          return s
        }, {}))
      .prop({
        _: opts,
        onchange(){
          this.dil = this.value
        },
        get(phrase){
          let e = this
          return new Promise((res, rej)=>{
            e.ready.then(()=>{
              var phr = Math.floor(phrase)
              phrase = Math.round(phrase % 1 * 10)
              if(e._.phr[phr]){
                res(e._.phr[phr].split('=')[phrase])
              }else{
                rej()
              }
  
            })
          })
        },
        refresh(){
          ('[phrase]').get().map(O.F.each('Lang'))
        },
        ready: new Promise(res=>{
  
          let i = setInterval(()=>{
            let c = O.i18n._
            if(c.r ? (c.r == c.ranges.length) : c.phr && Object.keys(c.phr).length){
              clearInterval(i)
              res(1)
              O.i18n.dil = c.lang
            }
          }, 100)
        })
      }).resp({
        dil(dil){
          this.View[dil].selected = true
          O.Disk._lang = dil
          O.ready.then(b=>b.Class('rtl', O.i18n._.rtl.indexOf(O.Disk._lang) == -1))
          let e = this, c = e._, set = function(res){
            c.lang = dil
            O.Disk['_l' + c.lang + (this[1] || '') + e._.scope] = res
            res = res.split('\n')
            if(e._.map){res = res.map(e._.map)}
            res.forEach(function(i, j){
              c.phr[j + this] = i
            }, this[0] || 1)
            if(this[2] == 'net'){
              var t = O.Disk._lTime || Array.from({length: c.ranges.length}).map(()=>0)
              t[this[1]] = O.Time.now
              O.Disk._lTime = t
            }
            c.r++
            e.refresh()
          }
          e.refresh()
          c.phr = null
          if(c.path){
            var res
            c.phr = {};
            (c.ranges || [1]).forEach(function(i, j){
              if(res = O.Disk['_l' + dil + (j || '') + e._.scope]){
                set.call([i, j], res)
              }else{
                O.req(this.vars({lang: dil, part: j, scope: e._.scope})).then(set.bind([i, j, 'net']))
              }
          
            }, c.path)
          }else{
            c.lang = dil
          }
          //this.View[this.dil].selected=false;
      
        }}).prop({dil: def})
  },

  toArray(obj){
    return (obj._ ? ((typeof obj._ == 'string') ? obj._.split(',') : obj._) : Object.keys(obj)).map(function(i){return obj[i]})
  },

  proto: {
    Element: {
      V(path){
        return (path || '').split(':')
          .reduce((s, i)=>s ? (i == '' ? s.View : (s.View[i] ? s.View[i] : null)) : null, this)
      },
      p(top){
        var s = this
        while(top--){
          s = s.parent
        }
        return s
      },
      resp(prop, f){
        return O.resp.call(this, prop, f)
      },
      stor(prop, key){
        return O.stor.call(this, prop, key)
      },
      extend(component, args){
        if(O.UI[component]){
          return O.UI[component].apply(this, args || [])
        }else{
          console.warn('₺' + component, 'is not defined')
          return this
        }
      },
      destroy(after, dur){
        let s = this
        return new Promise(res=>{
          
          setTimeout(()=>{
            setTimeout(()=>{s.remove();res()}, dur || 300)
            s.Class('destroy')
          }, after||0)
        })
      },
      interval(f, t, args, start){
        if(this._interval){
          if(typeof f == 'string'){
            this._interval[f]()
          }else
          if(isFinite(f)){
            this._interval[Number(f) > 0 ? 'start' : 'stop']()
          }
        }else{
          if(typeof f == 'string'){
            f = this[f]
          }
          this._interval = O.interval.apply(null, [f.bind(this), t].concat(args))
          if(start){
            this._interval.start()
            f.apply(this, args)
          }
        }
        return this
      },
      disp(bool){
        if(!bool && !this.hasOwnProperty('dispState')){
          this.dispState = this.style.display
        }
        this.style.display = bool ? this.dispState : 'none'
        return this
      },
      prop(k, val, attr){
        var e
        if(val == null && !(k instanceof Object) || (k instanceof Array)){
          if(k instanceof Array){
            e = {}
            k.forEach(i=>{
              e[i] = attr ? this.getAttribute(i) : this[i]
            }, this)
          }else{
            e = attr ? this.getAttribute(k) : this[k]
          }
        }else{
          e = this
          if(attr){
            
            if(!(k instanceof Object)){
              k = {[k]: val}
            }
            Object.keys(k).forEach(i=>{
              e.setAttribute(i, k[i])
            })
          }else{
            if(k instanceof Object){
              Object.keys(k).forEach(function(i){
                if(typeof(k[i]) == 'function'){k[i] = k[i].bind(e)}
              })
              Object.assign(this, k)
            }else{
              this[k] = val
            }
          }
        }
        return e
      },
      class(c){
        if(typeof c == 'function'){
          this.class(c())
        }else{
          let list = {add: [], rem: []}
          Object.keys(c).forEach(f=>{
            list[(typeof c[f] === 'function' ? c[f]() : c[f]) ? 'add' : 'rem'].push(f)
          })
          this.Class(list.rem, 1).Class(list.add)
        }
        return this
      },
      Class(c, r){
        if(!(c instanceof Array)){
          c = [c]
        }
        if(c[0] && c[0] != ''){
          this.className = c.reduce((a, b)=>{
            a = a.replace(new RegExp('(\\b' + b + ')+'), '')
            return (r ? a : (a + ' ' + b)).replace(/\s{2}/g, ' ').trim()
          }, this.className)
          if(this.className.trim() == ''){
            this.removeAttribute('class')
          }
        }
        return this
      },
      layout(lay, master){
        let s = master || this
        this.innerHTML = ''
        return this.append(
          lay.map(i=>{
            if(i instanceof Element){
              return i
            }else if(i instanceof Array){
              return i[0].layout(i[1], s)
            }else{
              return s.V(i) || i.init()
            }
          })
        )
      },
      do(method, on, args){
        if(arguments[3]){args = O.toArray(arguments).splice(2)}
        return this.prop('on' + (on || 'click'), function(){
          this.parent[method].apply(this.parent, args || [])
        })
      },
      append(e, rev){
        if(e){
          if(!(e instanceof Array)){
            e = [e]
          }else if(e[0] instanceof Array){
            e = e.map(i=>'d'.append(i))
          }
          if(rev){
            e = e.reverse()
          }
          e.forEach(i=>{
            if(!(i instanceof Node)){i = i.init()}
            this.appendChild(i)
          })
        }
        return this
      },
      has(e, before){
        if(e){
          if(!this.View){this.View = {}}
          if(e instanceof Array && !(e[0] instanceof Element)){
            var a = []
            for(var i in e){
              a.push('d'.has(e[i]))
              e[i].parent = this
              Object.assign(this.View, e[i])
            }
            e = a
          }
          if(typeof e != 'object' || e instanceof Element){
            e = [e]
          }
          if(e instanceof Object){
            //add sort function feature
            e = (e._ ? (typeof e._ == 'function' ? Object.keys(e).filter(i=>{
              return e[i] instanceof Element
            }).sort(e._) : e._) : Object.keys(e)).map(i=>{
              if(typeof e[i] == 'function'){
                e[i] = e[i]()
              }
              return (this.View[i] = e[i].prop({parent: this}))
            })
          }}
        return this.append(e, before)
      },
      html(e){
        this.innerHTML = ''
        return e ? this.has.apply(this, arguments) : this
      },
      Lang(i, phr){
        i = i || this.attr('phrase') || this.prop('phrase')
        let s = this

        s.attr('phrase', i)
        if(phr){
          s.prop('phr' + (typeof phr == 'function' ? 'Select' : ''), phr)
        }
        if(this.phr && this.phrSelect){
          i = Number(i) + this.phrSelect(this.phr) / 10
        }
        let type = this.attr('t') || this.t
        O.i18n.get(i).then(function(p){

          if(s.phr){
            if(!(s.phr instanceof Object)){
              s.phr = [s.phr]
            }
            p = p.vars(s.phr)
          }
          if(s.ttl){
            s.title = p
          }
          if(['title', 'placeholder'].indexOf(type) > -1){
            s.attr(type, p)
          }else{
            s.innerHTML = p
          }
        })
        return s
      },
      setSafe(t, phr){
        let rep = str => {
          if(typeof str == 'string'){
            str = str.replaceAll(
              [/&/g,
                /</g,
                />/g,
                /"/g,
                /'/g],
              ['&amp;',
                '&lt;',
                '&gt;',
                '&quot;',
                '&#039;']
            )
          }
          return str
        }
        return this.set(rep(t), rep(phr))
      },
      set(t, phr){
        if(this.hasOwnProperty('value') || this.__lookupSetter__('value')){
          this.value = t
          return this
        }
        if(t && !phr){
          let phrase
          if(phrase = this.attr('phrase')){
            if(!(t instanceof Object)){
              t = [t]
            }
            this.phr = t
            //console.log(1);
            this.Lang(phrase, t)
          }else if(t instanceof Object){
            if(!this.main){this.main = this.innerHTML}
            if(t._){
              this.innerHTML = ''
              this.append(this.main.varsX(this.data = t))
            }else{
              this.innerHTML = this.main.vars(this.data = t).replace(/\n/gm, '<br>')
            }
          }else{
            this.innerHTML = String(t).replace(/\n/gm, '<br>')
          }
        }else if(t){
          if(isFinite(t)){
            this.Lang(t, phr == 1 ? null : phr)
          }else{
            this.main = t
            if(phr._){
              this.innerHTML = ''
              this.append(this.main.varsX(this.data = phr))
            }else{
              this.innerHTML = this.main.vars(this.data = phr).replace(/\n/gm, '<br>')
            }
          }
        }else{
          this.innerHTML = ''
        }
        return this.Class('def', 1)
      },
      setView(d){
        let v = this.View
        //this.data=Object.assign(this.data||{},d);
        if(this.ondata){this.ondata(d)}
        (d._ || Object.keys(d)).forEach(i=>{
          if(v.hasOwnProperty(i)){
            v[i].set(d[i])
          }
        })
        return this
      },
      attr(k, v){
        return this.prop.apply(this, [k, v, 'attr'])
      },
      link(addr, href){

        this.href = href || addr
        this.addr = addr
        if(addr.indexOf('//') == -1 && !this.onclick){
          this.onclick = ((e)=>{
            if(O.Page != 'function'){
              O.Page.route(this.addr, 1)
            }
          }).prevent.stop
        }
        return this
      },
      connect(source, on, nav){
        if(!source){
          throw Error('.connect requires a data source. https://otagjs.org/#/belge/.connect')
        }
        on = on || 'oid'

        let f = (source instanceof Element
          ? function(ch) {
            this.val = source.val
          }
          : function(ch) {
            let d = source instanceof Function ? source(ch) : source[ch]
            f = d=>{this.val = d}
            if(d instanceof Promise){
              d.then(f)
            }else{
              f(d)
            }
          }).bind(this)
        
        if(nav){
          let range = null
          if(nav instanceof Object && nav.range){
            range = nav.range
          }
          this.prop({
            dataNav(to){
              if(this.source[to]){
                let p = this.source[to]
                  ,   f = p => {
                    this[on] = p
                  }
                if(typeof p == 'function'){
                  p = p()
                  p instanceof Promise ? p.then(f) : f(p)
                }else{
                  f(p)
                }
              }else{
                let r = range || [0, this.source.length - 1]
                  ,   i = this[on]
                i = to == 'prev' ? i - 1 : i + 1
                if(i < r[0]){
                  i = r[1]
                }else if(i > r[1]){
                  i = r[0]
                }
                this[on] = i
              }
              return this
            },
            next(){
              return this.dataNav('next')
            },
            prev(){
              return this.dataNav('prev')
            }
          })
        }
        this.prop('source', source).resp(on, f)
        if(source.hasOwnProperty('_conn')){
          source._conn(this, on)
        }
        return this
      },
      valid(validationMap, invalidCallback){
        this._validator = validationMap
        this._invalid = invalidCallback
        return this
      }
    },
    String: {
      get(index){
        let s = this + '', d = O._selector(s)
        if(d.args.length || d.ui){throw new Error('Module and argument selector is not available')}
        var th = O.toArray(document.querySelectorAll(this + ''))
        
        if(d.id){
          index = 0
        }
        if(index != null){
          th = th[index]
        }
        return th
      },
      init(){
        let s = this + '', d = O._selector(s)
        d.args = d.args.concat(O.toArray(arguments))
        if(d.ui){
          if(!O.UI[d.ui]){console.log(d.ui, 'is not defined')}
          d.el = O.UI[d.ui].apply(d.ui, d.args )
        }else{
          d.el = document.createElement(d.tag || 'div')
          if(d.args.length){
            d.el.set.apply(d.el, d.args)
          }
        }
        //Eğer kodunuz burada patlıyorsa, ₺Bileşen'i doğru oluşturmamışsınız demektir. ₺Bileşen Öge döndürmeli.
        d.el.Class(d.class).attr(d.attr)
        if(d.id){
          d.el.id = d.id
        }
        if(d.el.tagName == 'INPUT'){
          d.el.addEventListener('keyup', function(e){if(e.keyCode == 13 && this.enter){this.enter(this.value)}})
        }
        if(!d.el.View){d.el.View = {}}
        return d.el
      },
      extends(){
        let e = (this + '').get()
        if(e instanceof Array){
          return e.map(O.F.each('extend', O.toArray(arguments)))
        }else{
          return e.extend.apply(e, arguments)
        }
      },
      from(obj){
        let r = (this == '*' ? Object.keys(obj) : this.split(',')).map(i=>{return obj[i]})
        return (this.indexOf(',') == -1 && this != '*') ? r[0] : r
      },
      val(obj){
        let r = this.split(',').map(i=>{return obj.val[i]})
        return r.length == 1 ? r[0] : r
      },
      of(obj){
        return this == '*' ? obj : this.split(',').reduce((o, i)=>{o[i] = obj[i] || null;return o}, {})
      },
      obj(arr, def){
        return this.split(',').reduce(
          def instanceof Array
          //indise özgü öntanımlı
            ? (n, i, j)=>{
              n[i] = arr[j] || def[j]
              return n
            }
          //ortak öntanımlı
            : (n, i, j)=>{
              n[i] = arr[j] || def
              return n
            }
          , {})
      },
      vars(vars){
        vars = typeof vars == 'object' ? vars : arguments
        return Object.keys(vars).reduce((m, v)=>{
          return m.replace(new RegExp('(' + v + '[₺|$|₸|₼])+'), vars[v])
        }, this)
      },
      varsX(vars){
        vars = typeof vars == 'object' ? vars : arguments
        let v = Object.keys(vars).reduce((m, v)=>{
          return m.replace(new RegExp('(' + v + '[₺|$|₸|₼])+'), vars[v] instanceof Element ? '|' + v + '|' : vars[v])
        }, this).split('|')
        v = v.map((i, j)=>{
          return j % 2 ? vars[i] : document.createTextNode(i)

        })
        console.log(v)
        return v
      },
      replaceAll(f, r){
        var s = this
        for(var i in f){
          while(s.indexOf(f[i]) > -1){
            s = s.replace(f[i], r[i])
          }
        }
        return s
      }
    },
    Function: {
      interval(time){
        let interval, e = this 
        return {
          start(){
            this.stop()
            interval = setInterval.apply(null, [e, time].concat(arguments))
            return this
          },
          stop(){
            clearInterval(interval)
            return this
          }
        }
      },
      prom(bind){
        let f = this.bind(bind)
        return ()=>{
          let a = arguments
          return new Promise((res, rej)=>{
            try{
              var r = f.apply(null, a)
              res(r)
            }catch(e){
              rej(e)
            }
          })
        }
      },
      debounce (delay) {
        let f = this
        let tOut
        return function() {
          let a = arguments, s = this
          clearTimeout(tOut)
          tOut = setTimeout(()=>{f.apply(s, a)}, delay)
          return s
        }
      }
    },
    Image: {
      set(s){
        this.loader = new Promise((res, rej)=>{
          this.prop({
            onload(){this.Class('loading', 1);res()},
            onerror(){this.Class('loading', 1).Class('error');rej()}
            , src: s})
        })
        return this.Class('loading')
      }
    }
  },
  props: {
    Element: {
      el: {
        get(){
          return this.init()
        },
        set(){
          let el = this.el
          if(v.to){
            v.to.get(0).append(el)
            delete v.to
          }
          ['click'].forEach(i=>{
            delete v[i]
            if(v[i]){el['on' + i] = v[i]}
          })
            ['prop', 'has', 'layout', 'resp', 'set', 'attr', 'valid'].forEach(i=>{
              if(v[i]){
                el[i](v[i])
                delete v[i]
              }
            })
          Object.assign(el, v)
        }
      },
      val: {
        get(){
          if(typeof this.value == 'function'){
            return this.value()
          }
          else if(this.value || this.hasOwnProperty('value')){return this.value}
          else if(this.View){
            let d = {}, n = this, v
            if(Object.keys(this.View).some(i => {
              if(i[0] != '_' && !this.View[i].isSameNode(n)){
                if(this._validator && (v = this._validator[i])){
                  if(!(typeof v == 'function' ? v(this.View[i].val) : v.test(this.View[i].val))){
                    if(this._invalid){
                      this._invalid()
                    }
                    return true
                  }
                }
                d[i] = this.View[i].val
              }
              return false
            }, this)){
              return null
            }else{
              return d
            }
          }
          else{return this.data || null}
        },
        set(o){
          if(o instanceof Promise){
            let s = this
            o.then(o => {
              s.val = o
            })
          }
          if(this.View){this.setView(o)}else{this.set(o)}}
      }
    },
    Function: {
      prevent: {
        get(){
          return e => {
            e.preventDefault()
            this(e)
          }
        }
      },
      stop: {
        get(){
          return e => {
            e.stopPropagation()
            this(e)
          }
        }
      }
    },
    Image: {
      value: {
        get(){
          return this.src
        },
        set(src){
          this.loader = new Promise((res, rej)=>{
            this.prop({
              onload(){this.Class('loading', 1);res()},
              onerror(){this.Class('loading', 1).Class('error');rej()}
              , src})
          })
          this.Class('loading')
          return src
        }
      }
    }
  }
}

O.UI = {
  //'₺M:Model' yazımını sağlamak içindir,değiştirmeyin
  M(){
    let a = O.toArray(arguments)
    return O.Model[a.shift()].apply('', a)
  }
}
Otag.Model = {
  //Örnek bir Modeldir, ₺List'te Öntanımlıdır. Çok kullandığınız bir Model'le değiştirebilirsiniz.
  Default(i){
    var w = {}
    Object.keys(i)
      .forEach(j => {
        w[j] = j
      })
    return 'defaultModel'.has(w).setView(i)
  }
}

Object.keys(O.proto).forEach(i => Object.assign(window[i].prototype || window[i], O.proto[i]))
Object.keys(O.props).forEach(i => Object.defineProperties(window[i].prototype || window[i], O.props[i]))
Object.keys(O.proto.Element).forEach(i=>{
  Number.prototype[i] = String.prototype[i] = function(){
    let j = this.init()
    return j[i].apply(j, arguments)
  }
})
delete O.proto
delete O.props
