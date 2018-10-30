import O from '../yap/ES6'
import Disk from './Disk'

class Sanal {
  constructor(o = {_el: ''}) {
    Object.assign(this, o)
    if(o.ƒ) {
      Object.defineProperties(this,
        Object.keys(o.ƒ).reduce((p, f) => {
          console.log(f)

          p[f] = {
            get: o.ƒ[f]
          }
          return p
        }, {}))
    }
    if(o.resp) {
      Object.defineProperties(this,
        Object.keys(o.resp).reduce((p, r) => {
          p[r] = {
            get: () => this['_' + r],
            set(v) {
              o.resp[r](v)
              this['_' + r] = v
            }
          }
          return p
        }, {}))
    }
    if(this.shadow) {
      O.ready.then(() => this.el)
    }
    this.has(this.View)
  }
  V(path = '') {
    return path.split(':')
      .reduce((s, i) => s && s.View ? (i == '' ? s.View : s.View[i]) : null, this)
  }
  p(top) {
    let s = this
    while(top--) {
      s = s.parent
    }
    return s
  }
  do(method, event) {
    this.click = () => this.parent[method]()
    return this
  }
  has(View) {
    if(View) {
      Object.keys(View).forEach(i => {
        if(typeof View[i] == 'string') {
          if(View[i][0] == '₺') {
            View[i] = View[i].el
          }else{
            View[i] = new Sanal({_el: View[i], parent: this})
          }
        }
        if(!(View[i] instanceof Sanal)) {
          View[i].parent = this
          View[i] = new Sanal(View[i])
        }else{
          View[i].parent = this
        }
      })
      this.View = View
    }
    return this
  }
  append(e) {
    this.content = e
    return this
  }
  set content(i) {
    this.$content = i
    if(this._el && typeof this._el != 'string') {
      this._el.innerHTML = ''
      this._el.append(
        i.map(/*
          this.transition
          ?(i,j)=>{
            i.el.style.opacity=1
            return i.el.disp(0,null,this.transitionProperty).disp(1,j*10this.transition,this.transitionProperty)}
          : */i => i.el))
    }
  }
  get content() {
    return this.$content
  }
  set to(to) {
    this.el.to = to
  }
  get valid() {
    if(this.validate) {
      if(typeof this.validate == 'function') {
        return this.validate(this.value)
      }else{
        let v
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
        this.value = val
      })
      return
    }
    if(this.bind) {
      let content = []
      if(this.bind.before) {
        content.push(this.bind.before)
      }
      content = content.concat(Object.keys(o).map(i => {
        let obj = this.bind.model.el
        if(obj.source) { obj.oid = o[i] }else{
          obj.value = {key: i, value: o[i], _model: this.bind.model}
        }
        return obj
      }))
      if(this.bind.after) {
        content.push(this.bind.after)
      }
      this.content = content
    }else
    if(this.View) {
      if(o._model) { o = o.value }
      let k = Object.keys(o)
      k.forEach(i => {
        if(this.View[i]) {
          if(typeof this.View[i] == 'string') {
            this.View[i] = this.View[i].split(':').shift() + ':' + o[i]
          }else{
            this.View[i].value = o[i]
          }
        }
      })
      // for hidden calculated values
      Object.keys(this.View)
        .filter(v => k.indexOf(v) == -1)
        .forEach(i => {
          if(i in o) {
            this.View[i].value = o[i]
          }
        })
    }else if(this.el.set) {
      this.el.set(o)
    }
    if(this.set) {
      this.set(o)
    }
    if(this.change) {
      this.change()
    }
  }
  get value() {
    if(this.View) {
      Object
        .keys(this.View)
        .filter(i => i[0] != '_')
        .forEach(V => {
          this.View[V].value
        })
    }
  }
  get el() {
    let process = () => {
      this._el.sanal = this
      this.layout = this.template || Object.keys(this.View || {}).join('\n') + '\ncontent₺'

      if(typeof this.bind == 'string') {
        this.bind = {model: this.bind}
      }
      let _on = 'NULLOID', on
      if(this.source) {
        on = this.source.on || 'oid'
        if(on in this) { _on = this[on] }
        Object.defineProperty(this, on, {
          get: () => this['_' + on],
          set: (value) => {
            (this['_' + on] = value)
            this.value = this.source[value]
          }
        })
      }
      if(this.fetch) {
        this.fetcher = this.fetch
      }
      ['click', 'select', 'focus', 'load', 'keyup', 'keydown', 'keypress', 'change']
        .filter(i => this[i])
        .forEach(i => this._el['on' + i] = typeof this[i] == 'string' ? (e) => this[this[i]](e) : (e) => this[i](e))
      if(this.enter) {
        this._el.addEventListener('keyup', (e => e.keyCode == 13 ? this[this.enter](e.target.value) : null).prevent.stop)
      }
      if(_on != 'NULLOID') {
        this[on] = _on
      }
    }
    if(this._el && typeof this._el == 'string') {
      this._el = this._el.el
      process()
    }
    return this._el
  }
  set fetcher(f) {
    clearInterval(this._fetchInterval)
    let fetch = () => {
      O.req(f.from).then(r => {
        if(f.shape) {
          r = f.shape(r)
        }
        this.value = r
        if(f.save) {
          Disk[f.save] = r
          if(f.expire) {
            Disk.expire[f.save] = f.expire
          }
        }
      })
    }
    let data
    if(f.save && (data = Disk[f.save])) {
      this.value = data
    }else{
      fetch()
    }
    if(f.refresh) {
      this._fetchInterval = setInterval(fetch, f.refresh * 1e3)
    }
  }
  set layout(t) {
    this.el.innerHTML = ''
    let ln, gir, gir2, dis, last = this.el, branch = last, V = this.View
    t = t.split('\n').forEach((line) => {
      dis = line.trim()

      if(ln = dis.length) {
        gir2 = (line.length - ln) / 2
        if(V && this.V(dis)) { dis = this.V(dis).el } else
        if(dis[0] == ':') {
          if(last instanceof Text && gir == gir2) {
            branch.appendChild(document.createElement('br'))
            /* last.data += '<br>' + dis.substring(1).trimLeft()
            return */
          }
          dis = document.createTextNode(dis.substring(1).trimLeft())
        }else{
          dis = dis.el
          let ev = ['click', 'select', 'focus', 'load', 'keyup', 'keydown', 'keypress', 'change'];
          [...dis.attributes].forEach(i => {
            console.log(i)
            if(ev.indexOf(i.name) > -1) {
              dis['on' + i.name] = (e => this[i.value].call(this, e)).stop.prevent
            }else
            if(i.name == 'enter') {
              dis.addEventListener('keyup', (e => { console.log(e, e.keyCode); if(e.keyCode == 13) { this[i.value](e.target.value) } }).prevent.stop)
            }
          })
        }

        if(gir != null) {
          if(gir2 != gir) {
            branch = last
            for(let i = gir2 - 1; i < gir; i++) {
              branch = branch.p
            }
          }
        }
        if(dis instanceof Sanal) {
          dis = dis.el
        }
        branch.appendChild(dis)
        last = dis
        dis.p = branch
        gir = gir2
      }
    })
  }
}
export default Sanal