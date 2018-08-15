import Nesne from 'nesne'
export default function(window){
  console.log(window)
  Object.keys(prototype).forEach(i => Object.assign(window[i].prototype || window[i], prototype[i]))
  Object.keys(prototype.Element).forEach(i => {
    window.Number.prototype[i] = window.String.prototype[i] = function () {
      let j = this.init()
      return j[i].apply(j, arguments)
    }
  })
  Object.defineProperties(window.Element.prototype, {
    val: {
      get(){
        if(typeof this.value == 'function'){
          return this.value()
        }
        else if(this.value || this.hasOwnProperty('value')){return this.value}
        else if(this.View){
          let d = {}, n = this, v
          if(Object.keys(this.View).some(function(i){
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
          o.then(function(o){
            s.val = o
          })
        }
        this[this.View?'setView':'set'](o)
      }
    }
  })
}


let prototype = {
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
      return this.prop('on' + (on || 'click'), ()=>{
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
        this.onclick = function(e){
          e.preventDefault()
          if(O.Page != 'function'){
            O.Page.route(this.addr, 1)
          }
        }
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
      if(d.ui){
        if(!O.UI[d.ui]){console.log(d.ui, 'is not defined')}
        d.el = O.UI[d.ui].apply(d.ui, d.args.concat(O.toArray(arguments)))
      }else{
        d.el = document.createElement(d.el || 'div')
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
    prevent(){
      return e => {
        e.preventDefault()
        this(e)
      }
    },
    stop(){
      return e => {
        e.stopPropagation()
        this(e)
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
      return this.Class('loading').prop({
        onload(){this.Class('loading', 1)},
        onerror(){this.Class('loading', 1).Class('error')}
        , src: s})
    },
    value(){
      return this.src
    }
  }
}

var _selector = s => {
  var d = {
    attr: /\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9.-_şŞüÜöÖçÇİığĞ]+)"\]/g,
    class: /\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,
    id: /#([0-9A-Za-z\-_şŞüÜöÖçÇİığĞ]+)/,
    ui: /[$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,
    args: /:(\w+)/g,
    el: /^[a-zşüöçığ][a-zşüöçığ0-9]*?$/g  //tag
  }
  d = Object.keys(d).reduce(function(o, i){
    var rm = [], e, x = -1, r = d[i]
    while((e = r.exec(s)) && r.lastIndex != x){
      rm.push(e[0])
      x = r.lastIndex
      if(o[i] instanceof Object && !(o[i] instanceof Array)){
        o[i][e[1]] = e[2]
      }else{
        if(o[i] == null){
          o[i] = e[1] || e[0]
          s = s.replace(e[0], '')
          break
        }
        o[i].push(e[1])
      }
    }
    rm.forEach(function(i){
      s = s.replace(i, '')
    })
    return o
  }, {class: [], attr: {}, id: null, ui: null, args: [], el: null})

  if(s.length){
    d.class = d.class.concat(s.split(' '))
  }
  return d
}