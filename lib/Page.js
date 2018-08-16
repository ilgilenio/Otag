import Nesne from 'nesne'
import notFound from './ek/PageNotFound.js'

export default function Page(opts) {
  opts = Object.assign({
    routes:{},
    Nav:true,
    hide:[],
    notFound,
    handler: Oge=>{
      document.body.html(Oge)
    }
  }, opts || {})
  opts.hide.push('notFound')
  opts.routes.notFound = opts.notFound
  Element.prototype.router = function(r){
    return this.resp('route', function(route){
      if(this.route){
        delete  O.Page.routes[this.route]
      }
      O.Page.routes[route] = this
    }).prop('route', r)
  }
  O.Page = O.resp.call({
    to:new Proxy({}, {
      get(o, k){
        return function(){
          if(this){
            let args = Nesne.toArray(arguments)
            return ()=>{
              O.Page.routeSilent(k, (args.concat(Nesne.toArray(arguments))))
            }}
          O.Page.routeSilent(k, Nesne.toArray(arguments))
        }
      }
    }),
    routes:new Proxy({}, {
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
        r = this.notFound
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
        r = this.notFound
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
  },{
    now(now){
      // Önceki Beti atıl duruma sok
      if(this.now && this.now.idle){
        this.now.idle()
      }
      let name = now.name
      if(isFinite(name) && typeof O.i18n != 'function'){
        let s = this.title
        name = O.i18n.get(name).then(name => {
          s.set({page:name || ''})
        })
      }else{
        this.title.set({page:name || ''})
      }
    }
  })
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
}