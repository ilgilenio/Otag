import Nesne from 'nesne'

export default {
  Sock,
  req
}




export function Sock(opts){
  opts = Object.assign({
    url:null,       // websocket host
    q:{},          // query object
    interval:3000 // yeniden bağlanma 3s
  }, typeof opts == 'string' ? {url:opts} : (opts || {}))

  opts.q = Object.assign(opts.q, opts.socketio ? {

    transport:'polling',
    EIO:3
  } : {_osid:O._uid(16)})


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
  opts.url += '?' + _queryString(opts.q)
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
  }

export function req(ep, data){
  var XHR = new XMLHttpRequest()
  
  //backend+endpoint
  XHR.open(data ? 'POST' : 'GET', ep.indexOf('/') > -1 ? ep : (O._conf.req.ep.vars({ep:ep})), true)
  XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  return new Promise((res, rej)=>{
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
          }else{rej({error:'empty response'})}
        }else{
          rej({error:{code:this.status}})
        }
      }
    }
    XHR.send(data ? _queryString(data) : '')
  })     
  }

let _queryString = obj=>{
  let pr=arguments[1]
  var str = []
  for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
          var k = pr ? pr + '[' + p + ']' : p, v = obj[p]
          str.push(typeof v == 'object' ?_queryString(v, k) :encodeURIComponent(k) + '=' + encodeURIComponent(v))
      }
  }
  return str.join('&')
  }

let _uid = len => {
  len=len||6
  let str='',rnd
  while(len--){
    //A-Z 65-90
    //a-z 97-122
    rnd=Math.floor((Math.random(1e10)*1e5)%52)
    str+=String.fromCharCode(rnd+(rnd<26?65:71))
  }
  return str
  }