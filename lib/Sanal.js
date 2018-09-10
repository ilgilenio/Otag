
import {O, Disk} from '../o'

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
            get: ()=>this['_'+r],
            set(v){
              o.resp[r](v)
              this['_'+r]=v
            }
          }
          return p
        }, {}))
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
          View[i] = new Sanal({_el: View[i],parent:this})
        } else if(!(View[i] instanceof Sanal)) {
          View[i].parent=this
          View[i] = new Sanal(View[i])
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
    }
    if(this.bind) {
      let content = []
      if(this.bind.before) {
        content.push(this.bind.before)
      }
      content = content.concat(Object.keys(o).map(i => {
        let obj = this.bind.model.el
        obj.value = {key: i, value: o[i], _model: this.bind.model}
        return obj
      }))
      if(this.bind.after) {
        content.push(this.bind.after)
      }
      this.content = content
    }else
    if(this.View) {
      if(o._model) { o = o.value }
      Object.keys(o).forEach(i => {
        if(this.View[i]) {
          if(typeof this.View[i] == 'string') {
            this.View[i] = this.View[i].split(':').shift() + ':' + o[i]
          }else{
            this.View[i].value = o[i]
          }
        }
      })
    }else if(this.el.set) {
      this.el.set(o)
    }
    if(this.set) {
      this.set(o)
    }
  }
  get el() {
    if(typeof this._el == 'string') {
      this._el = this._el.el
      this._el.sanal = this
      if(this.template) {
        this.layout = this.template
      }else if(this.content) {
        this._el.append(this.content)
      }else if(this.View) {
        this._el.append(O.toArray(this.View))
      }
      if(typeof this.bind == 'string') {
        this.bind = {model: this.bind}
      }
      if(this.fetch) {
        let data
        if(this.fetch.save && (data = Disk[this.fetch.save])) {
          this.value = data
        }else{
          O.req(this.fetch.from).then(r => {
            if(this.fetch.shape) {
              r = this.fetch.shape(r)
            }
            this.value = r
            if(this.fetch.save) {
              Disk[this.fetch.save] = r
            }
          })
        }
      }
      ['click', 'load', 'select'].filter(i => this[i]).forEach(i => this._el['on' + i] = this[i])
    }
    return this._el
  }
  set layout(t) {
    this.el.innerHTML = ''
    let ln, gir, gir2, dis, last = this.el, branch = last, V = this.View
    t = t.split('\n').forEach((line) => {
      dis = line.trim()

      if(ln = dis.length) {
        gir2 = (line.length - ln) / 2
        if(V && V[dis]) { dis = V[dis].el }else if(dis[0] == ':') {
          if(last instanceof Text && gir == gir2) {
            last.data += '<br>' + dis.substring(1).trimLeft()
            return
          }
          dis = document.createTextNode(dis.substring(1).trimLeft())
        }else{
          dis = dis.el
        }

        if(gir != null) {
          if(gir2 != gir) {
            branch = gir2 > gir ? last : branch.p
          }
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