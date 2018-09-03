import Disk from 'o.disk'
import Nesne from 'nesne'

export default class Data{
  constructor (){
    this.Disklet = Disklet
    this.Socklet = Socklet
  }
}
/*
    O.Disklet('birUçnokta?id=id₺',{açar:OTURUMAÇARI},'uç_','*')
    url         : uçnokta ya da URL , id₺ değişkeni kullanılabilir.
    .           : {static:URL,when:('init'||'requested')} bu kullanımla 
    .           : durağan bir veriyi yükleyebilirsiniz.
    .
    data        : her istekte post ile gönderilecek veri nesnesi, id: açarı girilirse istenen açarla değiştirilir
    diskPrefix  : Yerel yığınağa kaydedilirken hangi öneke iye olacağı
    fields      : kaynaktan gelen verilerin hangi açarlarının gerekli olduğu.
    expire      : her bir nesnenin yerel yığınakta önbelleklenme süresi
  */
class Disklet{
  constructor (url, data, diskPrefix, fields, expire){
    if(url instanceof Object){
      expire = fields || 300
      fields = diskPrefix
      diskPrefix = data
      data = null
      let Src = {_ready: -1, sum: function (keys){
        let s = this
        return Object.keys(s).reduce(function (n, i){
          if(i != 'sum' && i != '_ready'){
            n[i] = keys.of(s[i])
          }
          return n
        }, {})
      }}
      let ready = function (){
        return new Promise(function (res){
          if(Disk[diskPrefix]){
            Src._ready = 1
            Nesne.combine(Src, Disk[diskPrefix])
            Src.sum = Src.sum.bind(Src)
            res(Src)
          }else if(Src._ready == -1){
            O.req(url.static).then(function (data){
              if(fields != '*'){
                data = Object.keys(data).reduce(function (o, i){
                  o[i] = fields.from(data[i])
                })
              }
              Src._ready = 1
              Nesne.combine(Src, Disk[diskPrefix])
              Src.sum = Src.sum.bind(Src)
              Disk.expire(diskPrefix, expire)
              res(Src)
            })
          }
        })
      }
      if(url.when == 'init'){
        ready()
      }
      return new Proxy(Src, {
        get: function (o, k){
          return new Promise(function (res){
            if(o._ready == 1){
              res(o[k])
            }else{
              ready().then(function (Src){
                o = Src
                res(o[k])
              })
            }
          })
        }
      })
    }else{
      return new Proxy(Disk, {
        get: function (o, k){
          return new Promise(function (res){
            let key = (diskPrefix || '') + k
            if(o[key]){
              res(o[key])
            }else{
              if(data && data.id){
                data.id = k
              }
              O.req(url.vars({id: k}), data).then(function (r){
                res(o[key] = fields.of(r))
                if(expire){
                  Disk.expire(key, expire)
                }
              })
            }
          })
        }
      })
    }
  }
}

export class Socklet{
  constructor (Sock, channel, data){
    let Ref = {}, Store = []
    Sock.on(channel, function (d){
      Object.keys(d).forEach(function (i){
        if(Ref[i]){
          while(Ref[i].length){
            Ref[i].pop()(d[i])
          }
          delete Ref[i]
        }else{
          Store.filter(function (s){
            return s[0][s[1]] == i
          }).forEach(function (s){
            s[0].val = d[i]  
          })
        }
      })
    })
    //combine data if set
    let cmb = data ? function (d){
      return Nesne.combine(Object.create(data), d)
    } : function (d){return d}
    return new Proxy({
      _conn: function (Elem, on){
        Store.push([Elem, on])
      },
      set: function (n){
        Sock.emit(channel, cmb({set: n}))
      }
    }, {
      get: function (o, k){
        if(o[k]){
          return o[k]
        }
        return new Promise(function (res){
          if(!Ref[k]){
            Ref[k] = []
          }
          Ref[k].push(res)
          Sock.emit(channel, cmb({get: k}))
        })
      },
      set: function (o, k, v){
        o.set({[k]: v})
      },
      deleteProperty: function (o, k){
        Sock.emit(channel, cmb({rem: k}))
      }
    })
  }
}
export function Dizi(data){
  let dizi
    , interval = false
    ,	i = 0 
    , step = function(to){
      i = dizi[(to ? 'next' : 'prev') + 'Key']
      debugger
      return dizi.value
    }
    ,	shadow = {
      get nextKey(){
        let l = dizi.length
        return i + 1 >= l ? 0 : i + 1
      },
      get prevKey(){
        let l = dizi.length
        return i - 1 < 0 ? l : i - 1
      },
      get next(){
        return step(this, 1)
      },
      get max(){
        return dizi.reduce((max, key)=>{
          return key > max ? key : max
        }, -Infinity)
      },
      get min(){
        return dizi.reduce((min, key)=>{
          return min > key ? key : min
        }, Infinity)
      },
      get prev(){
        return step(this)
      },
      get value(){
        return dizi[i]
      },
      set interval({val}){
        if(interval){
          clearInterval(interval)
        }
        interval = setInterval(()=>step(dizi, 1), val)
      },
      set value({store, val}){
        if(val instanceof Array){
          store.splice(0, 1500)
          while(val.length){
            store.push.apply(dizi, val.splice(0, 500))
          }
        }else{
          i = val
        }
      } 
    }
  let ext = Object.keys(shadow)
  return dizi = new Proxy(data || [], {
    get(store, key){
      if(ext.indexOf(key) > -1){
        return shadow[key]
      }else{
        return store[key]
      }
    },
    set(store, key, val){
      if(ext.indexOf(key) > -1){
        shadow[key] = {store, val}
        return 1
      }
      store[key] = val
      return 1
    }
  })
}