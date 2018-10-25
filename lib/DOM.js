import {O} from '../yap/ES6'
import Sanal from './Sanal'
import Disk from './Disk'

let _selector = s => {
  let args = []
  let attrRegex = /\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9,'.-_şŞüÜöÖçÇİığĞ#\(\):@ ]+)"\]/g
  let attr = (s.match(attrRegex) || []).reduce((attr, i) => {
    s = s.replace(i, '')
    i = i.match(/([0-9A-Za-z.şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9,.-_şŞüÜöÖçÇİığĞ#\(\):@ ]+)/)
    attr[i[1]] = i[2]
    return attr
  }, {})
  if(s.indexOf(':') > -1) {
    args = s.split(':')
    s = args.shift()
  }
  var d = {
    class: /\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,
    id: /#([0-9A-Za-z\-_şŞüÜöÖçÇİığĞ]+)/,
    ui: /[$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,
    tag: /^[a-zşüöçığ][a-zşüöçığ0-9]*?$/g
  }
  d = Object.keys(d).reduce((o, i) => {
    var rm = [], e, x = -1, r = d[i]
    while((e = r.exec(s)) && r.lastIndex != x) {
      rm.push(e[0])
      x = r.lastIndex

      if(o[i] instanceof Array) {
        o[i].push(e[1])
      }else{
        o[i] = e[1] || e[0]
        s = s.replace(e[0], '')
        break
      }
    }
    rm.forEach(i => {
      s = s.replace(i, '')
    })
    return o
  }, {class: [], id: '', ui: null, tag: null})
  d.args = args
  d.attr = attr
  if(s.length) {
    d.class = d.class.concat(s.split(' '))
  }
  return d
}
let proto = {
  Element: {
    destroy(after = 0, dur = 300) {
      return new Promise(res => {
        setTimeout(() => {
          setTimeout(() => { this.remove(); res() }, dur)
          this.Class('destroy')
        }, after)
      })
    },
    disp(bool) {
      if(!bool && !this.hasOwnProperty('dispState')) {
        this.dispState = this.style.display
      }
      this.style.display = bool ? this.dispState : 'none'
      return this
    },
    class(c) {
      if(typeof c == 'function') {
        this.class(c())
      }else{
        let list = {add: [], rem: []}
        Object.keys(c).forEach(f => {
          list[(typeof c[f] === 'function' ? c[f]() : c[f]) ? 'add' : 'rem'].push(f)
        })
        this.Class(list.rem, 0).Class(list.add)
      }
      return this
    },
    Class(name, r = true) {
      if(!(name instanceof Array)) {
        name = [name]
      }
      if(name[0] && name[0] != '') {
        this.className = name.reduce((a, b) => {
          a = a.replace(new RegExp('(\\b' + b + ')+'), '')
          return (r ? (a + ' ' + b) : a).replace(/\s{2}/g, ' ').trim()
        }, this.className)

        if(this.className.trim() == '') {
          this.removeAttribute('class')
        }
      }
      return this
    },
    do(method, on = 'click', args) {
      if(arguments[3]) {
        args = [...arguments].splice(2)
      }
      this['on' + on] = () => {
        this.parent[method].apply(this.parent, args || [])
      }
      return this
    },
    append(elems, reverse) {
      if(elems) {
        if(!(elems instanceof Array)) {
          elems = [elems]
        }
        if(reverse) {
          elems = elems.reverse()
        }

        elems.forEach(i => this.appendChild(i.el))
      }
      return this
    },
    set(str) {
      if(typeof (str) == 'string') {
        str = str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/"/g, '&quot;')
        this.innerHTML = str
      }
      return this
    },
    pitch(e) {
      if(e.html) {
        this.innerHTML = Disk[e.html]
      }
      this.innerHTML = ''
      return e ? this.append.apply(this, arguments) : this
    }
  },
  String: {
    kur(otag = {}) {
      return new Sanal(Object.assign(otag, {_el: this}))
    },
    val(obj) {
      let r = this.split(',').map(i => { return obj.val[i] })
      return r.length == 1 ? r[0] : r
    },
    vars(vars) {
      vars = typeof vars == 'object' ? vars : arguments
      return Object.keys(vars).reduce((m, v) => {
        return m.replace(new RegExp('(' + v + '[₺|$|₸|₼])+'), vars[v])
      }, this)
    },
    replaceAll(f, r) {
      let s = this
      for(var i in f) {
        while(s.indexOf(f[i]) > -1) {
          s = s.replace(f[i], r[i])
        }
      }
      return s
    },
    of(obj) {
      return this == '*' ? obj : this.split(',').reduce((o, i) => { o[i] = obj[i] || null; return o }, {})
    },
    from(obj) {
      let r = (this == '*' ? Object.keys(obj) : this.split(',')).map(i => obj[i])
      return (this.indexOf(',') == -1 && this != '*') ? r[0] : r
    },
    obj(arr, def) {
      return this.split(',').reduce(
        def instanceof Array
          ? (n, i, j) => {
            n[i] = arr[j] || def[j]
            return n
          }
          : (n, i, j) => {
            n[i] = arr[j] || def
            return n
          }
        , {})
    }
  },
  Function: {
    interval(time) {
      let interval, e = this
      return {
        start(...args) {
          this.stop()
          interval = setInterval.apply(null, [e, time].concat(args))
          return this
        },
        stop() {
          clearInterval(interval)
          return this
        }
      }
    },
    prom(bind) {
      let f = this.bind(bind)
      return (...args) => {
        return new Promise((res, rej) => {
          try{
            var r = f.apply(null, args)
            if(r.then) { r.then(res).catch(rej) }else(res(r))
          }catch(e) {
            rej(e)
          }
        })
      }
    },
    debounce(delay) {
      let f = this
      let tOut
      return function(...args) {
        clearTimeout(tOut)
        tOut = setTimeout(() => { f.apply(f, args) }, delay)
        return this
      }
    }
  },
  SVGElement: {
    set(src, height, width) {
      this.disp(0)
      O.req(src).then(i => {
        let tmp = (new DOMParser()).parseFromString(i, 'text/xml').children[0];
        [...tmp.attributes].forEach(attr =>
          this.setAttribute(attr.name, attr.value)
        )
        this.style.height = height
        this.style.width = width
        this.innerHTML = tmp.innerHTML
        this.disp(1)
      })
      return this
    }
  },
  Image: {
    set(s, svg) {
      if(svg) {
        O.req(s).then(i => this.innerHTML = i)
        return this
      }
      this.loader = new Promise((res, rej) => {
        Object.assign(this, {
          onload() {
            this.Class('loading', 0)
            res()
          },
          onerror() {
            this
              .Class('loading', 0)
              .Class('error')
            rej()
          },
          src: s})
      })
      return this.Class('loading')
    }
  }
}
let props = {
  String: {
    get: {
      get() {
        var nodes = [...document.querySelectorAll(this)]

        if(this.indexOf('#') > -1) {
          nodes = nodes[0]
        }
        return nodes
      }
    },
    to: {
      set(value) {
        this.el.to = value
      }
    },
    el: {
      get() {
        let d = _selector(this + ''), el
        if(d.ui) {
          if(!O.UI[d.ui]) { console.error(d.ui, 'is not defined') }
          el = O.UI[d.ui].apply(d.ui, d.args)
        }else{
          el = d.tag == 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : document.createElement(d.tag || 'div')
          if(d.args.length) {
            el.set.apply(el, d.args)
          }
        }
        // Eğer kodunuz burada patlıyorsa, ₺Bileşen'i doğru oluşturmamışsınız demektir. ₺Bileşen Öge döndürmeli.
        Object.keys(d.attr).map(attr => el.setAttribute(attr, d.attr[attr]))
        if(d.id.length) {
          el.id = d.id
        }
        if(d.class.length) {
          el.className = d.class.join(' ')
        }
        return el
      },
      set(v) {
        let el = this.el;

        ['click', 'load'].forEach(i => {
          delete v[i]
          if(v[i]) { el['on' + i] = v[i] }
        });

        ['prop', 'has', 'layout', 'resp', 'set', 'attr', 'valid'].forEach(i => {
          if(v.hasOwnProperty()) {
            el[i](v[i])
            delete v[i]
          }
        })
        if(v.to) {
          if(typeof v.to == 'string') {
            v.to.append(el)
          }else{
            el.to = v.to
          }
          delete v.to
        }
        Object.assign(el, v)
        return el
      }
    }
  },
  Element: {
    sanal: {
      get() { return this._sanal },
      set(sanal) {
        let enter = this.getAttribute('enter')
        if(enter) {
          this.addEventListener('keyup', (e => { if(e.keyCode == 13) { sanal.parent[enter](this.value) } }).prevent.stop)
        }
        if(this.innerHTML.indexOf('₺') > -1) {
          this.innerHTML = this.innerHTML.vars(sanal)
        }
        this._sanal = sanal
      }
    },
    el: {
      get() { return this }
    },
    str: {
      get() {
        let ext = ['id', 'class']
        let str = this.tagName != 'DIV' ? this.tagName.toLowerCase() : ''
        str += (this.id != '' ? '#' + this.id : '')
        str += [...this.classList].map(i => '.' + i)
          .join('')
        ;[...this.attributes].forEach((i) => {
          if(ext.indexOf(i.name) < 0) {
            i.value = i.value.replace('https:', '').replace('http:', '')
            str += '[' + i.name + '="' + i.value + '"]'
          }
        })
        return str
      }
    },
    to: {
      set(toElem) {
        if(typeof (toElem) == 'string') {
          O.ready.then(() => {
            let elm = toElem.get
            elm = (elm instanceof Array ? elm[0] : elm)
            if(!elm) {
              console.error('"seçici₺" ile belgede öge bulunamadı'.vars({seçici: toElem}))
              return 0
            }
            elm.pitch(this)
          })
        }else{
          if(toElem instanceof Sanal) { toElem = toElem.el }
          toElem.pitch(this)
        }
      }
    }
  },
  Function: {
    prevent: {
      get() {
        return e => {
          e.preventDefault()
          this(e)
        }
      }
    },
    stop: {
      get() {
        return e => {
          e.stopPropagation()
          this(e)
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
            onload() { this.Class('loading', 0); res() },
            onerror() { this.Class('loading', 0).Class('error'); rej() },
            src})
        })
        this.Class('loading')
        return src
      }
    }
  }
}

export default
(root => {
  Object.keys(proto).filter(i => root[i].prototype || root[i])
    .forEach(i => Object.assign(root[i].prototype || root[i], proto[i]))
  Object.keys(props).filter(i => root[i].prototype || root[i])
    .forEach(i => Object.defineProperties(root[i].prototype || root[i], props[i]))
  Object.keys(proto.Element).forEach(i => {
    root.Number.prototype[i] = root.String.prototype[i] = function(...args) {
      let j = this.kur()
      return j[i].apply(j, args)
    }
  })
})(window || global)