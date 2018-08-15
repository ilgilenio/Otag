import Nesne from 'nesne'
export default function(window){
  console.log(window)
  Object.keys(prototype).forEach(i => Nesne.combine(window[i].prototype || window[i], prototype[i]))
  Object.keys(prototype.Element).forEach(i => {
    window.Number.prototype[i] = window.String.prototype[i] = function () {
      let j = this.init()
      return j[i].apply(j, arguments)
    }
  })
  Object.defineProperties(window.Element.prototype,{
    valx:{
      get:function(){
        if(typeof this.value == 'function'){
          return this.value()
        }
        else if(this.value || this.hasOwnProperty('value')){return this.value}
        else if(this.View){
          let d = {},n = this,v
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
          },this)){
            return null
          }else{
            return d
          }
        }
        else{return this.data || null}
      },
      set:function(o){
        if(o instanceof Promise){
          let s = this
          o.then(function(o){
            s.val = o
          })
        }
        if(this.View){this.setView(o)}else{this.set(o)}
      }
    }
  })
}


let prototype = {
  Element:{
    /*
        A=''.has({a:''.has({b:''})})
        A.V('a:')   // {a:''.has({b:'B'})}   //Nesne Bağ Haritası
        A.V('a:b')  //<div class="B"></div>  //Öge

        Ögenin alt Ögelerini getirir, (verilen yolda) 
      */
    V:function (path){
      return (path || '').split(':').reduce(function (s,i){
        return s ? (i == '' ? s.View : (s.View[i] ? s.View[i] : null)) : null
      },this)
    },
    p:function (top){
      var s = this
      while(top--){
        s = s.parent
      }
      return s
    },
    // tanıma duyarlı özellik tanımlar
    resp:function (prop,f){
      return O.resp.call(this,prop,f)
    },
    // barındırılan özellik tanımlar
    stor:function (prop,key){
      return O.stor.call(this,prop,key)
    },
    /*
        String.prototype.extends incele
      */
    extend:function (component,args){
      if(O.UI[component]){
        return O.UI[component].apply(this,args || [])
      }else{
        console.warn('₺' + component,'is not defined')
        return this
      }
    },
    /*
        after kadar bekle-> .destroy sınıfı ekle-> dur kadar bekle-> belgeden kaldır.
        .destroy için bir CSS tanımlayınız, transition-duration değeri dur girdisi ile aynı olsun.
        .destroy{
          transition: .2s linear; // Geçiş 200ms
        }
        Öge.destroy(0,200)          // hemen yoketmeye başla 200ms sonra belgeden kaldır

        Öge'yi yavaşça siler
      */
    destroy:function (after,dur){
      let s = this
      return new Promise(function (res){
          
        setTimeout(function (){
          setTimeout(function (){s.remove();res()},dur || 300)
          s.Class('destroy')
        },after||0)
      })
    },
    /*
        ---- Tanımlama
        f    : İşlev||Yazı // Çağrılacak işlev ya da öge yöntemi
        t    : Sayı        // zaman aralığı
        args : Dizi        // işleve verilecek girdiler
        start: Mantıksal   // başlatılsın mı
        
        ---- Yönetim
        f    : ('start'||1) veya ('stop'||0)    // Yapılacak İşlem

        Öge'ye bağlamın korunduğu bir zaman aralıklı işlev tanımlar
      */
    interval:function (f,t,args,start){
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
        this._interval = O.interval.apply(null,[f.bind(this),t].concat(args))
        if(start){
          this._interval.start()
          f.apply(this,args)
        }
      }
      return this
    },
    /*
        Öge='Öge'.disp( );      // Gizle
           Öge .disp(0);      // Gizle
           Öge .disp(1);      // Göster
           Öge .disp(1==1);   // Göster
     
        Öge'yi gösterir/gizler
      */
    disp:function (bool){
      if(!bool && !this.hasOwnProperty('dispState')){
        this.dispState = this.style.display
      }
      this.style.display = bool ? this.dispState : 'none'
      return this
    },
    /*
        Öge='Öge'.has({a:1});
        Öge.a                    // 1

        Öge'ye özellik tanımlar
      */
    prop:function (k,val,attr){
      var e
      if(val == null && !(k instanceof Object) || (k instanceof Array)){
        if(k instanceof Array){
          e = {}
          k.map(function (i){
            e[i] = attr ? this.getAttribute(i) : this[i]
          },this)
        }else{
          e = attr ? this.getAttribute(k) : this[k]
        }
      }else{
        e = this
        if(attr){
            
          if(!(k instanceof Object)){
            k = {[k]:val}
          }
          Object.keys(k).forEach(function (i){
            e.setAttribute(i,k[i])
          })
        }else{
          if(k instanceof Object){
            Object.keys(k).forEach(function (i){
              if(typeof(k[i]) == 'function'){k[i] = k[i].bind(e)}
            })
            Nesne.combine(this,k)
          }else{
            this[k] = val
          }
        }
      }
      return e
    },
    /*
        Öge='Öge'.Class(['a','b']); // a,b ekle
           Öge .Class('c');       // c ekle
           Öge .Class('b',1);     // b kaldır
        <div class="Öge a c"></div>

        Öge'ye Sınıf ekler/kaldırır
      */
    class:function (c){
      if(typeof c == 'function'){
        this.class(c())
      }else{
        let list = {add: [], rem: []}
        Object.keys(c).forEach(function (f){
          list[(typeof c[f] === 'function' ? c[f]() : c[f]) ? 'add' : 'rem'].push(f)
        })
        this.Class(list.rem,1).Class(list.add)
      }
      return this
    },
    /*
        Öge='Öge'.Class(['a','b']); // a,b ekle
           Öge .Class('c');       // c ekle
           Öge .Class('b',1);     // b kaldır
        <div class="Öge a c"></div>

        Öge'ye Sınıf ekler/kaldırır
      */
    Class:function (c,r){
      if(!(c instanceof Array)){
        c = [c]
      }
      if(c[0] && c[0] != ''){
        this.className = c.reduce(function (a,b){
          a = a.replace(new RegExp('(\\b' + b + ')+'),'')
          return (r ? a : (a + ' ' + b)).replace(/\s{2}/g,' ').trim()
        },this.className)
      }
      return this
    },
    // Kullanıcı arayüzü şablonu oluşturur
    layout:function (lay,master){
      let s = master || this
      this.innerHTML = ''
      return this.append(
        lay.map(function (i){
          if(i instanceof Element){
            return i
          }else if(i instanceof Array){
            return i[0].layout(i[1],s)
          }else{
            return s.V(i) || i.init()
          }
        })
      )
    },
    /*
        Ata yöntemi çağırır
        .has ile çalışır
        'Ata'.prop({
          okAt:f(yayTürü)
        }).has({
          Çocuk:'Çocuk'.do('okAt','click',['uzunYay'])
        })
      */
    do:function (method,on,args){
      if(arguments[3]){args = Nesne.toArray(arguments).splice(2)}
      return this.prop('on' + (on || 'click'),function (){
        this.parent[method].apply(this.parent,args || [])
      })
    },
    /*
        a='a'.init(),b='b'.init();
        Öge='Öge'.append([a,b]);    // a,b ekle
        <div class="Öge"><a></a><b></b></div>

        Öge='Öge'.append([a,b],1);  // a,b ekle, ama tersten
        <div class="Öge"><b></b><a></a></div>       
    

        Öge'ye alt Öge ekler
      */
    append:function (e,rev){
      if(e){
        if(!(e instanceof Array)){
          e = [e]
        }else if(e[0] instanceof Array){
          e = e.map(function (i){
            return 'd'.append(i)
          })
        }
        if(rev){
          e = e.reverse()
        }
        e.forEach(function (i){
          if(!(i instanceof Node)){i = i.init()}
          this.appendChild(i)
        },this)
      }
      return this
    },
    /*
        
        Öge='Öge'.has({a:'a',b:'b'});
        Öge.View.a              //<a></a>
        Öge.View.a.parent       //<div class="Öge">..

        <div class="Öge"><a></a><b></b></div>
    

        Öge'ye alt öge ekler, arasını bağlar
      */
    has:function (e,before){
      if(e){
        if(!this.View){this.View = {}}
        if(e instanceof Array && !(e[0] instanceof Element)){
          var a = []
          for(var i in e){
            a.push('d'.has(e[i]))
            e[i].parent = this
            Nesne.combine(this.View,e[i])
          }
          e = a
        }
        if(typeof e != 'object' || e instanceof Element){
          e = [e]
        }
        if(e instanceof Object){
          //add sort function feature
          e = (e._ ? (typeof e._ == 'function' ? Object.keys(e).filter(function (i){
            return e[i] instanceof Element
          }).sort(e._) : e._) : Object.keys(e)).map(function (i){
            if(typeof e[i] == 'function'){
              e[i] = e[i]()
            }
            return (this.View[i] = e[i].prop({parent:this}))
          },this)
        }}
      return this.append(e,before)
    },
    html:function (e){
      this.innerHTML = ''
      return e ? this.has.apply(this,arguments) : this
    },
    /*
        .___________________.
        | 1| Esenlikler ad₺ |
        | 2|                |
        |___________________|

        Öge='Öge'.Lang(1,{ad:'Yertinç'});

        <div class="Öge"></div>

        Dil yüklendiğinde
        <div class="Öge">Esenlikler Yertinç</div>
    

        Öge'nin dil deyiş sayısını değiştirir.
      */
    Lang:function (i,phr){
      i = i || this.attr('phrase') || this.prop('phrase')
      let s = this

      s.attr('phrase',i)
      if(phr){
        s.prop('phr' + (typeof phr == 'function' ? 'Select' : ''),phr)
      }
      if(this.phr && this.phrSelect){
        i = Number(i) + this.phrSelect(this.phr) / 10
      }
      let type = this.attr('t') || this.t
      O.i18n.get(i).then(function (p){

        if(s.phr){
          if(!(s.phr instanceof Object)){
            s.phr = [s.phr]
          }
          p = p.vars(s.phr)
        }
        if(s.ttl){
          s.title = p
        }
        if(['title','placeholder'].indexOf(type) > -1){
          s.attr(type,p)
        }else{
          s.innerHTML = p
        }
      })
      return s
    },
    setSafe:function (t,phr){
      let rep = function (str){
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
      return this.set(rep(t),rep(phr))
    },
    /*
        Öge='Öge'.set('Esenlikler ad₺!',{ad:'Yertinç'});
        <div class="Öge">>Esenlikler Yertinç!</div>

        Öge.set({ad:'Otağ'});
        Öge.val                 // {ad:'Otağ'});
        <div class="Öge">Esenlikler Otağ!</div>
    
        Öge'nin içine yazı yazar
      */
    set:function (t,phr){
      if(t && !phr){
        let phrase
        if(phrase = this.attr('phrase')){
          if(!(t instanceof Object)){
            t = [t]
          }
          this.phr = t
          //console.log(1);
          this.Lang(phrase,t)
        }else if(t instanceof Object){
          if(!this.main){this.main = this.innerHTML}
          if(t._){
            this.innerHTML = ''
            this.append(this.main.varsX(this.data = t))
          }else{
            this.innerHTML = this.main.vars(this.data = t).replace(/\n/gm,'<br>')
          }
        }else{
          this.innerHTML = String(t).replace(/\n/gm,'<br>')
        }
      }else if(t){
        if(isFinite(t)){
          this.Lang(t,phr == 1 ? null : phr)
        }else{
          this.main = t
          if(phr._){
            this.innerHTML = ''
            this.append(this.main.varsX(this.data = phr))
          }else{
            this.innerHTML = this.main.vars(this.data = phr).replace(/\n/gm,'<br>')
          }
        }
      }else{
        this.innerHTML = ''
      }
      return this.Class('def',1)
    },
    /*

        Öge='Öge'.has({a:'a',b:'b'});
        Öge.setView({a:'Esenlikler',b:'Yertinç'})

        <div class="Öge"><a>Esenlikler</a><b>Yertinç</b></div>
    

        Öge'nin alt ögelerine değer verir.
      */
    setView:function (d){
      let v = this.View
      //this.data=Nesne.combine(this.data||{},d);
      if(this.ondata){this.ondata(d)}
      (d._ || Object.keys(d)).forEach(function (i){
        if(v.hasOwnProperty(i)){
          v[i].set(d[i])
        }
      })
      return this
    },
    /*

        Öge='Öge'.atttr({ni:'te',li:'k'});
        

        <div class="Öge" ni="te" li="k"></div>
    

        Öge'ye nitelik tanımlar
      */
    attr:function (k,v){
      return this.prop.apply(this,[k,v,'attr'])
    },
    link:function (addr,href){

      this.href = href || addr
      this.addr = addr
      if(addr.indexOf('//') == -1 && !this.onclick){
        this.onclick = function (e){
          e.preventDefault()
          if(O.Page != 'function'){
            O.Page.route(this.addr,1)
          }
        }
      }
      return this
    },
    /*
        .connect
        Bir veri kaynağına ögeyi bir özelliğine göre bağlar
        belirtilen özellik değiştiğinde, veri kaynağından veri çekilerek öge güncellenir.
        
        let Veri={ 1:{a:'A1',b:'B1'} }

        Öge='Öge'.has({a:'',b:''}).connect('otag_id',Veri);
        Öge.otag_id = 1 // Öge 1 deki verilerle güncellenir..

        source(*)   : Veri Kaynağı(Nesne) | Disklet
        on          : hangi özelliğe duyarlı   
        nav         : null | true | {range:[int,int]} // .next .prev olsun mu
      */
    connect:function (source,on,nav){
      if(!source){
        throw Error('.connect requires a data source. https://otagjs.org/#/belge/.connect')
      }
      on = on || 'oid'

      let f = (source instanceof Element
        ? function (ch){
          this.val = source.val
        }    
        : function (ch){
          let d = source instanceof Function ? source(ch) : source[ch]
          f = (function (d){ this.val = d}).bind(this)
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
          dataNav:function (to){
            if(this.source[to]){
              let p = this.source[to]
                ,   f = (function (p){
                  this[on] = p
                }).bind(this)
              if(typeof p == 'function'){
                p = p()
                p instanceof Promise ? p.then(f) : f(p)
              }else{
                f(p)
              }
            }else{
              let r = range || [0,this.source.length - 1]
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
          next:function (){
            return this.dataNav('next')
          },
          prev:function (){
            return this.dataNav('prev')
          }
        })
      }
      this.prop('source',source).resp(on,f)
      if(source.hasOwnProperty('_conn')){
        source._conn(this,on)
      }
      return this
    },
    /*
        Ögenin Verisini isterken doğrular
        'Form'.has({
          ad:'input',
          yaş:'input[type="number"]',
        }).valid({
          ad:/[a-zA-ZçğıöşüÇĞİÖŞÜ]+/g,
          yaş: yaş => isFinite(yaş)&&yaş>18&&yaş<100
        })
      */
    valid:function (validationMap,invalidCallback){
      this._validator = validationMap
      this._invalid = invalidCallback
      return this
    }
  },
  String:{
      
    /* 
        '.CSS.Seçici'.get() // [Öge,Öge..]
        '#Kimlik'.get() // Öge

        Belgedeki Ögeleri getirir
      */
    get:function (index){
      let s = this + '',d = _selector(s)
      if(d.args.length || d.ui){throw new Error('Module and argument selector is not available')}
      var th = Nesne.toArray(document.querySelectorAll(this + ''))
        
      if(d.id){
        index = 0
      }
      if(index != null){
        th = th[index]
      }
      return th
    },
    /* 
        '.CSS.Seçici'.init() // <div class="CSS Seçici"></div>

        ₺Bileşen çağırır / ₺M:Model çağırır / Öge oluşturur.
      */
    init:function (){
      let s = this + '',d = _selector(s)
      if(d.ui){
        if(!O.UI[d.ui]){console.log(d.ui,'is not defined')}
        d.el = O.UI[d.ui].apply(d.ui,d.args.concat(Nesne.toArray(arguments)))
      }else{
        d.el = document.createElement(d.el || 'div')
      }
      //Eğer kodunuz burada patlıyorsa, ₺Bileşen'i doğru oluşturmamışsınız demektir. ₺Bileşen Öge döndürmeli.
      d.el.Class(d.class).attr(d.attr)
      if(d.id){
        d.el.id = d.id
      }
      if(d.el.tagName == 'INPUT'){
        d.el.addEventListener('keyup',function (e){if(e.keyCode == 13 && this.enter){this.enter(this.value)}})
      }
      if(!d.el.View){d.el.View = {}}
      return d.el
    },
    /* 
        '#ResimKutusu'.extends('Bediz')

        Bileşeni belgede bulunan Ögeler ile çağırır.
      */
    extends:function (){
      let e = (this + '').get()
      if(e instanceof Array){
        return e.map(O.F.each('extend',Nesne.toArray(arguments)))
      }else{
        return e.extend.apply(e,arguments)
      }
    },
    /* 
        'o,t,a,g'.from({g:2,o:'bc',a:5,t:5,y:2017}).join('') // 'bc552'

        Nesneden belirli özelliklerin değerlerini sırayla getirir. Dizi oluşturur
      */

    from:function (obj){
      let r = (this == '*' ? Object.keys(obj) : this.split(',')).map(function (i){return obj[i]})
      return (this.indexOf(',') == -1 && this != '*') ? r[0] : r
    },
    /* 
        Öge='Öge'.has({a:'a'.prop('value',1),b:'b'.prop('value',2)});
        'a,b'.val(Öge)       // [1,2]
        'a,b'.from(Öge.val) // [1,2] aslında bu demektir.

        Öge'nin değerinden istenilen alanları sırayla getirir. Dizi oluşturur
      */
    val:function (obj){
      let r = this.split(',').map(function (i){return this[i]},obj.val)
      return r.length == 1 ? r[0] : r
    },
    /* 
         nesneyi istenilen alanlara göre keser
         'ad,soyad'.of({ad:'',soyad:'',bediz:''}) => {ad:'',soyad:''}
      */
    of:function (obj){
      return this == '*' ? obj : this.split(',').reduce(function (o,i){o[i] = obj[i] || null;return o},{})
    },
    /*
        Diziden nesne yapar
        'ad,soyad,bediz,özellik1'.obj(['koraltan','temren','temren.jpg']) =>
        {ad:'koraltan',soyad:'temren',bediz:'temren.jpg'}
        def girdisine, dizide o indis yoksa belirecek öntanımlı değer girebilirsiniz
        bu öntanımlı değer hepsi için ortak ya da indise özgü olabilir.
      */
    obj:function (arr,def){
      return this.split(',').reduce(
        def instanceof Array
        //indise özgü öntanımlı
          ? function (n,i,j){
            n[i] = arr[j] || def[j]
            return n
          }
        //ortak öntanımlı
          : function (n,i,j){
            n[i] = arr[j] || def
            return n
          }
        ,{})
    },
    /* 
        'Esenlikler yer₺!'.vars({yer:'Yertinç'}) //Esenlikler Yertinç!

        Değişken₺ tanımlı Yazı'ları işler
      */
    vars:function (vars){
      vars = typeof vars == 'object' ? vars : arguments
      return Object.keys(vars).reduce(function (m,v){
        return m.replace(new RegExp('(' + v + '[₺|$|₸|₼])+'),vars[v])
      },this)
    },
    varsX:function (vars){
      vars = typeof vars == 'object' ? vars : arguments
      let v = Object.keys(vars).reduce(function (m,v){
        return m.replace(new RegExp('(' + v + '[₺|$|₸|₼])+'),vars[v] instanceof Element ? '|' + v + '|' : vars[v])
      },this).split('|')
      v = v.map(function (i,j){
        return j % 2 ? vars[i] : document.createTextNode(i)

      })
      console.log(v)
      return v
    },
    replaceAll:function (f,r){
      var s = this
      for(var i in f){
        while(s.indexOf(f[i]) > -1){
          s = s.replace(f[i],r[i])
        }
      }
      return s
    }
  },
  Function:{
    prevent: function (){
      return e => {
        e.preventDefault()
        this(e)
      }
    },
    stop: function (){
      return e => {
        e.stopPropagation()
        this(e)
      }
    },
    /*
        f=function(){}
        f=f.prom();
        f(girdiler).then(tamamlandı)

        İşlevi Söz'e derler.
        ancak bir Nesne'nin yöntemini derleyecekseniz girdi olarak nesnesini vermelisiniz
        örnekSöz=localStorage.getItem.prom(localStorage)
      */
    prom:function (bind){
      let f = this.bind(bind)
      return function (){
        let a = arguments
        return new Promise(function (res,rej){
          try{
            var r = f.apply(null,a)
            res(r)
          }catch(e){
            rej(e)
          }
        })
      }
    },
    /*
        Belirli bir zaman için işlevi sınırlandırır,geciktirir.
      */
    debounce :function (delay) {
      let f = this
      let tOut
      return function () {
        let a = arguments,s = this
        clearTimeout(tOut)
        tOut = setTimeout(function (){
          f.apply(s, a)
        },delay)
        return s
      }
    }
  },
  Image:{
    set:function (s){
      return this.Class('loading').prop({
        onload:function (){this.Class('loading',1)},
        onerror:function (){this.Class('loading',1).Class('error')}
        ,src:s})
    },
    value:function (){
      return this.src
    }
  }
}

var _selector = function(s){
  var d = {
    attr:/\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9.-_şŞüÜöÖçÇİığĞ]+)"\]/g,
    class:/\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,
    id:/#([0-9A-Za-z\-_şŞüÜöÖçÇİığĞ]+)/,
    ui:/[$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,
    args:/:(\w+)/g,
    el:/^[a-zşüöçığ][a-zşüöçığ0-9]*?$/g  //tag
  }
  d = Object.keys(d).reduce(function(o,i){
    var rm = [],e,x = -1,r = d[i]
    while((e = r.exec(s)) && r.lastIndex != x){
      rm.push(e[0])
      x = r.lastIndex
      if(o[i] instanceof Object && !(o[i] instanceof Array)){
        o[i][e[1]] = e[2]
      }else{
        if(o[i] == null){
          o[i] = e[1] || e[0]
          s = s.replace(e[0],'')
          break
        }
        o[i].push(e[1])
      }
    }
    rm.forEach(function(i){
      s = s.replace(i,'')
    })
    return o
  },{class:[],attr:{},id:null,ui:null,args:[],el:null})

  if(s.length){
    d.class = d.class.concat(s.split(' '))
  }
  return d
}