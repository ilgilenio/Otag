/*    _             _
  o  | |        o  | |                o
 _   |/   __,  _   |/   __  _  __    _    __
  |  |   /  | / |  |   |_/ / |/  |  / |  /  \
  |_/|__/\_/|/  |_/|__/|__/  |   |_/  |_/\__/
          /|
*         \|    2016-2018 ilgilenio® 
*               Otag Çatı Çalışması 1.3.2.3
*               https://gitlab.com/ilgilenio/Otag/wikis
*               MIT ile dagitilmaktadir
*/
'use strict'

import DOM from './lib/DOM'

import i18n from './lib/i18n'
import Time from './lib/Time'
import Chain from './lib/Chain'
import Page from './lib/Page'
import Net from './lib/Net'

import Nesne from 'nesne'
import Disk from 'o.disk'

DOM(global||window)

let config = {
  req:{ep:'/ep₺'},
}
export {DOM,i18n,Time,Chain,Net,Page,Disk}
export default class Otag {
  constructor (opts = {}){
    Nesne.combine(config,opts)
    Nesne.combine(this,{
      UI : {
        //'₺M:Model' yazımını sağlamak içindir,değiştirmeyin
        M:function (){
            let a = Nesne.toArray(arguments)
            return O.Model[a.shift()].apply('',a)
        }
      },
      Model : {
        //Örnek bir Modeldir, ₺List'te Öntanımlıdır. Çok kullandığınız bir Model'le değiştirebilirsiniz.
        Default:function (i){
            var w = {}
            Object.keys(i)
                .forEach(function (j){
                    w[j] = j
                })
            return 'defaultModel'.has(w).setView(i)
        }
      },
      ready : new Promise(function (res){
        document.addEventListener('DOMContentLoaded',function (){
          res(document.body)
        })
      })
    })
    
  }
  interval (){
    let interval,args = arguments
    return {
      start:function (){
        this.stop()
        interval = setInterval.apply(null,args)
        return this
      },
      stop:function (){
        clearInterval(interval)
        return this
      }
    }
  }
  resp (prop,f){
    if(typeof prop == 'string'){
      prop = {[prop]:f}
    }
    let e = this || {}
    Object.defineProperties(e,Object.keys(prop).reduce(function (s,p){
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
          get:function (f){
            return f ? fx : this['_' + p]
          },
          set:function (val){
            if(val != this[p]){
              // Tek bir duyar mı var yoksa birden fazla mı duyar eklenmiş?
              if(typeof fx == 'function'){
                fx.call(this,val)
              }else{
                fx.forEach(function (i){
                  i.call(this,val)
                },this)
              }
              this['_' + p] = val
              
            }
          }
        }
      }
      return s
    },{}))
    return e
  }
  stor (prop,storekey){
    if(typeof prop == 'string'){
      prop = {[prop]:storekey}
    }
    return Object.keys(prop).reduce(function (e,p){
      var store = prop[p],v
      e = O.resp.call(e,p,function (val){
        Disk[store] = val
      })
      if((v = Disk[store]) != null){
        e[p] = v
        e.__lookupSetter__(p).call(e,e[p],1)
      }else if(e[p] != undefined){
        e.__lookupSetter__(p).call(e,e[p],1)
      }
      return e
    },this || {})
  }
  define (cls,methods){
    if(!this[cls]){
      this[cls] = {}
    }
    Object.keys(methods).forEach(function (i){
      this[cls][i] = methods[i]
    },this)
  }
    
}
