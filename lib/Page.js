import none from './ek/PageNotFound.js'
import Sanal from './Sanal'

export default class Page {
  constructor(opts = {}) {
    opts = Object.assign({
      routes: {},
      none,
      handler: 'body'
    }, opts)

    opts.routes.none = opts.none
    this.handler = opts.handler
    this.title = opts.title
    let route = this.routes = opts.routes
    Object.keys(route).filter(r => typeof (route[r]) != 'string')
      .map(r => {
        if(!(route[r] instanceof Sanal)) {
          route[r] = new Sanal(route[r])
        }
        if(!route[r].name) {
          route[r].name = r
        }
        route[r]._name = route[r].name
        Object.defineProperty(route[r], 'name', {
          get: () => {
            return route[r]._name
          },
          set: (name) => {
            this.setTitle(name)
            this.Nav.value = {[r]: name}
            route[r]._name = name
          }
        })
        return route[r]
      })

    this.route()
    window.onpopstate = this.route.bind(this)
  }
  setTitle(title) {
    this._titleInfo = title = title || this._titleInfo
    document.title = this.title
  }
  get title() {
    return (this._title || 'title₺').vars({title: this._titleInfo})
  }
  set title(title) {
    this._title = title
    this.setTitle(title)
  }
  route(hash) {
    let push = 0
    if(!hash) {
      hash = decodeURI(location.hash)
    }
    if(hash instanceof Object && !(hash instanceof Array)) {
      push = hash.type && hash.type == 'pushstate'
      hash = hash.state || decodeURI(location.hash)
    }
    var h = hash.split('/')
    if(h[0] == '#') { h.shift() }

    if(h[0] == '' && this.routes.index) {
      return this.route('index')
    }
    let r, page = h.shift()
    if(!(r = this.routes[page])) {
      page = 'none'
      r = this.routes.none
    }
    if(typeof r == 'string') { return this.route(r) }
    if(typeof r == 'function') { r.apply(null, h) }
    if(r instanceof Sanal) {
      let pageChanged = this.page != page
      if(this.change) {
        this.change(page, h, pageChanged, !!r.once)
      }
      this.page = page
      if(this.handler) {
        if(typeof this.handler == 'function') {
          this.handler(r)
        }else if(typeof this.handler == 'string') {
          r.to = this.handler
        }else if(this.handler.handle) {
          this.handler.handle(r, pageChanged)
        }else{
          r.to = this.handler
        }
      }
      if(r.once) {
        r.once.apply(r, h)
        delete r.once
      }else
      if(r.wake) { r.wake.apply(r, h) }
    }
    if(!push) {
      window.history[(push ? 'push' : 'replace') + 'State'](hash, null, hash.indexOf('#') == -1 ? '#/' + hash : hash)
    }
  }
  Navigation(opts = {}) {
    opts = Object.assign({
      hide: []
    }, opts)

    opts.hide.push('none')
    let el = this.Nav = 'Nav'.kur({
      View: Object.keys(this.routes).filter(i => (typeof (this.routes[i]) != 'string') && (opts.hide.indexOf(i) == -1))
        .reduce((o, i) => { o[i] = 'a[href="/#/' + i + '"][title="' + this.routes[i].name + '"]:' + this.routes[i].name; return o }, {})
    })
    return el
  }
  set page(page) {
    if(this._page != page) {
      this.now = this.routes[page]
      this._page = page
    }
  }
  get page() {
    return this._page
  }
  set now(now) {
    // Önceki Beti atıl duruma sok
    if(this.now && this.now.idle) {
      this.now.idle()
    }
    let {name} = now
    this.setTitle(name)
    this._now = now
  }
  get now() {
    return this._now
  }
  set to(handler) {
    this.handler = handler
  }
}