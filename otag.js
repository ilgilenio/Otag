/*    _             _
  o  | |        o  | |                o
 _   |/   __,  _   |/   __  _  __    _    __
  |  |   /  | / |  |   |_/ / |/  |  / |  /  \
  |_/|__/\_/|/  |_/|__/|__/  |   |_/  |_/\__/
      /|
*         \|    2016-2018 ilgilenio® 
*               Otag Çatı Çalışması 1.3
*               https://gitlab.com/ilgilenio/Otag/wikis
*               MIT ile dagitilmaktadir
*/
"use strict"
var O,Otag=O={
  /*
    Betik getirir, 
    js    : dosyanın  adı (sonuna .js yazmadan)
    path  : dosyanın yolu
  */
  require:function(js,path){
    return new Promise(function(res,rej){
      O.ready.then(b=>{
        document.head.append('script'.attr('src',(path||'')+js+'.js').prop({onload:function(){
          res(js);
        }}));
      });
    })
  },
  /*
    Geçmiş/Yönlendirme/Sayfalama Yöneticisi
    Belirlediğiniz yollara göre işlev çağırabilirsiniz, yönlendirme yapabilirsiniz
    Öge uyandırabilirsiniz.
    
    Örnek kullanım
    https://ilgilenio.github.io/Otag/ornekler/Atasozleri
    // ! Kararsız, değişiklikler oluşabilir.
  */
  Page:function(opts){
    opts=O.combine({
      routes:{},
      Nav:true,
      hide:[],
      none:"Bulunamadı".prop({
         name: 'Bulunamadı'
      }).layout([
         ["center", [
        'h1'.set('Bet Bulunamadı'),
        'p'.set("Aradığınız bet bulunamadı")
         ]]
      ]),
      handler:function(Oge){
        document.body.html(Oge);
      }
    },opts||{});
    opts.hide.push('none');
    opts.routes.none=opts.none;
    Element.prototype.router=function(r){
      return this.resp('route',function(route){
        if(this.route){
          delete  O.Page.routes[this.route];
        }
        O.Page.routes[route]=this;
      }).prop('route',r);
    }
    O.Page=O.resp.call({
      to:new Proxy({},{
        get:function(o,k){
          return function(){
            if(this){
              let args=O.toArray(arguments);
              return function(){
                O.Page.routeSilent(k,(args.concat(O.toArray(arguments))));
            }}
            O.Page.routeSilent(k,O.toArray(arguments));
          }
        }
      }),
      routes:new Proxy({},{
        set:function(o,k,v){
          o[k]=v;
          if(opts.Nav&&v instanceof Element&&(opts.hide.indexOf(k)<0)){
            O.Page.Nav.append('a'.link(k,'#/'+k).set(v.name));

          }
          return true;
        },
        get:function(o,k){
          return o[k]?o[k]:null;
        }
      }),
      routeSilent:function(page,args,push){
        if(page==''&&this.routes.index){
          return this.routeSilent('index',args);
        }
        let r;
        if(!(r=this.routes[page])){
           r=this.none;
        }
        if(typeof r=='string'){return this.routeSilent(r,args);}
        if(typeof r=='function'){r.apply(null,args);}
        if(r instanceof Element){
          this.now=r;
          if(opts.handler){
            let handle=function(r){
              if(opts.handler.handle){
                opts.handler.handle(r);
              }else{
                opts.handler.html(r);
              }
            }
            if(typeof opts.handler =='function'){
              opts.handler(r);

            }else if(typeof opts.handler=='string'){
              O.ready.then(b=>(opts.handler=opts.handler.get())&&handle(r))
            }else{
              handle(r);
            }
          }
          if(r.once){
            r.once.apply(r,args);
            delete r.once;
          }else
          if(r.wake){r.wake.apply(r,args);}
        }
        window.history[(push?'push':'replace')+'State'](page,null,'#/'+page)
      },

      route:function(hash,push){
        /* 
          if(hash instanceof Object){
          hash=hash.state||'';
        }
        if(opts.resolver){
          opts.resolver(hash).then(this.routeComplete);
        }*/
        if(hash instanceof Object&&!(hash instanceof Array)){
          hash=hash.state||'';
        }
        var h=hash.split('/');
        if(hash instanceof Array){
          h=hash;
          hash=hash.join('/');
        }else{
          h=hash.split('/')
          if(h[0]=='#'){h.shift();}
        }
        if(h[0]==''&&this.routes.index){
          return this.route('index');
        }
        let r,r1;
        if(!(r=this.routes[h.shift()])){
           r=this.none;
        }
        if(typeof r=='string'){return this.route(r);}
        if(typeof r=='function'){r.apply(null,h);}
        if(r instanceof Element){
          this.now=r;
          if(opts.handler){
            let handle=function(r){
              if(opts.handler.handle){
                opts.handler.handle(r);
              }else{
                opts.handler.html(r);
              }
            }
            if(typeof opts.handler =='function'){
              opts.handler(r);

            }else if(typeof opts.handler=='string'){
              O.ready.then(b=>(opts.handler=opts.handler.get())&&handle(r))
            }else{
              handle(r);
            }
          }
          if(r.once){
            r.once.apply(r,h);
            delete r.once;
          }else
          if(r.wake){r.wake.apply(r,h);}
        }
        window.history[(push?'push':'replace')+'State'](hash,null,'#/'+hash)
      }
    },{now:function(now){
      // Önceki Beti atıl duruma sok
      if(this.now&&this.now.idle){
        this.now.idle();
      }
      let name=now.name;
      if(isFinite(name)&&typeof O.i18n!='function'){
        let s=this.title;
        name=O.i18n.get(name).then(function(name){
          s.set({page:name||''});
        });
      }else{
        this.title.set({page:name||''});
      }
      
    }});
    if(opts.Nav){
      O.Page.Nav=opts.Nav==true?'Nav'.init():opts.Nav;
    }
    Object.keys(opts.routes).forEach(function(v){
      O.Page.routes[v]=opts.routes[v];
    })
    let init=function(){
      var title;
      if(!(title='title'.get()).length){
        document.head.append(title=['title'.init()])
      }
      if(title[0].innerHTML.indexOf('page₺')==-1){
        title[0].set('page₺')
      }
      
      this.title=title[0];
      this.route(decodeURI(location.hash.substring(2)),1);
      window.onpopstate=this.route.bind(this);
    };
    O.ready.then(init.bind(O.Page));
    return O.Page;
  },
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
  Disklet:function(url,data,diskPrefix,fields,expire){
    if(url instanceof Object){
      expire=fields||300;
      fields=diskPrefix;
      diskPrefix=data;
      data=null;
      let Src={_ready:-1,sum:function(keys){
        let s=this;
        return Object.keys(s).reduce(function(n,i){
          if(i!='sum'&&i!='_ready'){
            n[i]=keys.of(s[i]);
          }
          return n;
        },{});
      }};
      let ready=function(){
        return new Promise(function(res,rej){
          if(O.Disk[diskPrefix]){
            Src._ready=1;
            O.combine(Src,O.Disk[diskPrefix]);
            Src.sum=Src.sum.bind(Src);
            res(Src);
          }else if(Src._ready==-1){
            O.req(url.static).then(function(data){
              if(fields!='*'){
                data=Object.keys(data).reduce(function(o,i){
                  o[i]=fields.from(data[i]);
                });
              }
              Src._ready=1;
              O.combine(Src,O.Disk[diskPrefix]);
              Src.sum=Src.sum.bind(Src)
              O.Disk.expire(diskPrefix,expire);
              res(Src);
            })
          }
        });
      }
      if(url.when=='init'){
        ready();
      }
      return new Proxy(Src,{
        get:function(o,k){
          return new Promise(function(res,rej){
            if(o._ready==1){
              res(o[k]);
            }else{
              ready().then(function(Src){
                o=Src;
                res(o[k]);
              })
            }
          });
          return o[k];
        }
      });
    }else{
      return new Proxy(O.Disk,{
        get:function(o,k){
          return new Promise(function(res,rej){
            let key=(diskPrefix||'')+k;
            if(o[key]){
              res(o[key]);
            }else{
              if(data&&data.id){
                data.id=k;
              }
              O.req(url.vars({id:k}),data).then(function(r){
                res(o[key]=fields.of(r));
                if(expire){
                  O.Disk.expire(key,expire);
                }
              });
            }
          });
        }
      });
    }
  },
  /*
    let chain=O.Chain([f(),g(),h()]);
    chain(ilkİşleveGirdiler).then(başarı).catch(başarısız);

    f   : işlevler Dizisi
    obj : this olacak Nesne

    Birinin çıktısı bir sonrakinin girdisi olacak şekilde işlevleri sırayla çağırır. 
    Zincir tamamlanınca çözülecek bir Söz döndürür.
  */
  Chain:function(f){
    var obj = this||null;
    return function(){
      let args=arguments;
      obj=this||obj;
      return new Promise(function(res,rej){
        var prom=f.shift().prom().apply(obj,args),i;
        while(i=f.shift()){
          prom=prom.then(i).catch(rej);
        }
        prom.then(res).catch(rej);

      });
    };
  },
  /*
    O.resp.call({},{prop:f()})

    prop    : Duyarlı özellik
    f       : Atanırken çağrılacak işlev

    Bir nesneye tanıma duyarlı özellik tanımlar.
  */
  resp:function(prop,f){
    if(typeof prop=='string'){
      prop={[prop]:f};
    }
    let e=this||{};
    Object.defineProperties(e,Object.keys(prop).reduce(function(s,p){
      var fx=prop[p];let fOld=0;
      // Bu özellikte daha önceden tanımlanmış bir duyar var mı
      if(e.__lookupGetter__(p)){
        fOld=e.__lookupGetter__(p)(1);
        if(typeof fOld=='function'){fOld=[fOld];}
        //Eski duyarla yeni duyarı birleştir.
        fx=fOld.concat(fx);
      }else{
        if(e[p]!=undefined){e['_'+p]=e[p];}
      }
      if(!fOld){
        s[p]={
          get:function(f){
            return f?fx:this['_'+p];
          },
          set:function(val){
            if(val!=this[p]){
              // Tek bir duyar mı var yoksa birden fazla mı duyar eklenmiş?
              if(typeof fx=='function'){
                fx.call(this,val)
              }else{
                fx.forEach(function(i){
                  i.call(this,val);
                },this)
              }
              this['_'+p]=val;
              
            }
          }
        };
      }
      return s;
    },{}));
    return e;
  },
  /*
    O.stor.call({},{prop:storekey})
    O.stor.call({},'prop','storekey')

    prop    : Nesnede özellik adı
    storekey: Yığınakta tutulacak değişkenin adı

    Bir nesneye tanıma duyarlı özellik tanımlar.
  */
  stor:function(prop,storekey){
    if(typeof prop=='string'){
      prop={[prop]:storekey};
    }
    return Object.keys(prop).reduce(function(e,p){
      var store=prop[p],v;
      e=O.resp.call(e,p,function(val){
        O.Disk[store]=val;
      });
      if((v=O.Disk[store])!=null){
        e[p]=v;
        e.__lookupSetter__(p).call(e,e[p],1);
      }else if(e[p]!=undefined){
        e.__lookupSetter__(p).call(e,e[p],1);
      }
      return e;
    },this||{});
  },
  /*
    O.ready.then(body=> )
  
    Belge yüklenince çözümlenecek bir Söz döndürür,
  */
  ready:new Promise(function(res,rej){
    document.addEventListener('DOMContentLoaded',function(){
      res(document.body);
    });
  }),
  _selector:function(s){
    var d= {
      attr:/\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9.-_şŞüÜöÖçÇİığĞ]+)"\]/g,
      class:/\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,
      id:/\#([0-9A-Za-z\-_şŞüÜöÖçÇİığĞ]+)/,
      ui:/[\$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,
      args:/\:(\w+)/g,
      el:/^[a-zşüöçığ][a-zşüöçığ0-9]*?$/g  //tag
    };
    d=Object.keys(d).reduce(function(o,i){
      var rm=[],e,x=-1,r=d[i];
      while((e=r.exec(s))&&r.lastIndex!=x){
        rm.push(e[0]);
        x=r.lastIndex;
        if(o[i] instanceof Object&&!(o[i] instanceof Array)){
          o[i][e[1]]=e[2];
        }else{
          if(o[i]==null){
            o[i]=e[1]||e[0];
            s=s.replace(e[0],'');
            break;
          }
          o[i].push(e[1]);
        }
      }
      rm.forEach(function(i){
        s=s.replace(i,'');
      });
      return o;
    },{class:[],attr:{},id:null,ui:null,args:[],el:null});

    if(s.length){
      d.class=d.class.concat(s.split(' '))
    }
    return d;
  },
  /*
    ₺M:Model ve ₺Bileşen tanımlamak içindir.
  */
  define:function(cls,methods){
    if(!this[cls]){
      this[cls]={};
    }
    Object.keys(methods).forEach(function(i){
      this[cls][i]=methods[i];
    },this);
  },
  _conf:{
    req:{ep:'/ep₺'},
  },
  /*
    O.Time.now       Şimdi (UNIX zamanı) sn cinsinden verir.
    O.Time.yesterday Dünün ilk sn verir.

  */
  Time:new Proxy({
    yesterday:864e5,
    today:0,now:0,
    tomorrow:-864e5
  },{get:function(a,b,c){
    let t=new Date(+new Date-a[b]);
    if(b!='now'){
      t.setHours(0);
      t.setMinutes(0);
      t.setSeconds(0);
    };return Math.floor(t.getTime()/1000)}}),
  /*
    O.Disk.açar = 'değer'
    O.Disk.açar        // 'değer'
    delete O.Disk.açar

    Yerel Yığınağa bilgi yazmak/okumak/silmek için kullanılır.
  */
  Disk:typeof Storage!="undefined"?new Proxy({available:true,expire:function(key,time){
      O.Disk[key+':expire']=O.Time.now+Number(time);
    },rem:function(k){
      if(typeof k=='string'){k=[k];}
      k.forEach(function(i){
        localStorage.removeItem(i);
      });
    }
  },{
    get:function(o,k){
      if(o[k]){return o[k];}
      let e;
      if(e=localStorage.getItem(k+':expire')){
        if(Number(e)<O.Time.now){
          delete O.Disk[k];
          return null;
        }
      }
      k=localStorage.getItem(k);
      try{
        return JSON.parse(k);
      }
      catch(Exception){
        return k;
      }
    }
    ,set:function(o,k,v){
      localStorage.setItem(k,JSON.stringify(v));
      return true;
    }

    ,deleteProperty:function(o,k){
      return delete localStorage[k];
    }
    ,has:function(o,k){
      return localStorage[k]?true:false;
    }
  }):{available:false},
  /*
    O.combine({},{},..)
    Nesneleri birleştirir.
  */
  combine:function(){
    let args=O.toArray(arguments),o=args.shift();
    if(!(o instanceof Object)){o=o.init();}
    return args.reduce(function(o,i){
      return Object.keys(i).reduce(function(o,p){
        o[p]=i[p];
        return o;
      },o);
    },o);
  },
  /*
    Ertelenmiş Kütüphane
    Yazarlar: @Noras, @alpr
  */
  Sock:function(opts){
    opts=O.combine({
      url:null,       // websocket host
      q:{},          // query object
      interval:3000 // yeniden bağlanma 3s
    },typeof opts =='string'?{url:opts}:(opts||{}));
    opts.q=O.combine(opts.q,{_osid:O._uid(16)});
    opts.url=opts.url||window.location.origin; // başarımı artırmak için öntanımlı opts nesnesinde değil

    let r;
    if(r=/((ws|http)s?):\/\//g.exec(opts.url)){
      r=r[1];
      if(r.substr(0,4)=='http'){
        opts.url=(r.length>4?'wss://':'ws://')+opts.url.split('://')[1]
      }
    }else{
      opts.url='wss://'+opts.url;
    }
    opts.url+='?'+O._queryString(opts.q);
    let on={},socket,connectInterval;

    return ({
      on:function(topic,f){
        if(topic instanceof Object){
          Object.keys(topic).forEach(function(t){
            on[t]=topic[t];
          })
        }else{
          on[topic]=f;
        }
        return this;
      },
      connect:function(){
        if(!this.connected){
          try{
            socket=new WebSocket(opts.url+'&_tstamp='+O.Time.now);
          }catch(e){
            if(connectInterval){
              clearInterval(connectInterval);
            }
            connectInterval=setInterval(function(c){
              c.connect();
            },opts.interval,this.lib);
          }
          if(connectInterval){
            clearInterval(connectInterval);
          }
          this.connected=1;
          socket.lib=this;
          socket.onmessage=function(e){
            e=e.data;
            let offset=e.indexOf(','),topic=e.substr(0,offset);
            if(on[topic]){
              on[topic](JSON.parse(e.substring(offset+1)),this);
            }
          }
          socket.onerror=socket.onclose=function(e){
            if(e.type&&on[error])
            this.lib.connected=0;
            connectInterval=setInterval(function(c){
              c.connect();
            },opts.interval,this.lib);
          }
        }
        return this;
      },
      emit:function(topic,message){
        socket.send(topic+','+JSON.stringify(message));
      }
    }).connect();
  },
  /*
    O.req('veritabanı',{kimlik:''}).then(f(cevap))
    ep:     uçnokta,    YAZI
    data:   veri,       NESNE

    AJAX isteği yapar; data boş ise GET, dolu ise POST isteği yapar.
    Söz döndürür.
  */
  req:function(ep,data,upload){
    var XHR=new XMLHttpRequest();
    
    //backend+endpoint
    XHR.open(data?'POST':"GET",ep.indexOf('/')>-1?ep:(O._conf.req.ep.vars({ep:ep})),true);
    XHR.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    return new Promise(function(res,rej){
      XHR.onreadystatechange=function(){
        if(this.readyState==4){
          if(this.status==200){
            if(this.response!=''){
              var r;
              try{
                r=JSON.parse(this.response);
              }catch(e){
                r=this.response;
              }
              res(r);
            }else{rej({error:'empty response'});}
          }else{
            rej({error:{code:this.status}});
          }
        }
      };
      XHR.send(data?O._queryString(data):'');
    });     
  },
  _queryString:function(obj){
    let pr=arguments[1];
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = pr ? pr + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?O._queryString(v, k) :encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  },
  _uid:function(len){
    len=len||6;
    let str='',rnd;
    while(len--){
      //A-Z 65-90
      //a-z 97-122
      rnd=Math.floor((Math.random(1e10)*1e5)%52);
      str+=String.fromCharCode(rnd+(rnd<26?65:71));
    }
    return str;
  },
  /*
    Uluslararasılaştırma(U18A) Betliği
    // ! Kararsız, değişiklikler oluşabilir
  */
  i18n:function(opts){
    opts=O.combine({
      langs:{tr:'Türkçe'},
      map:null,
      rtl:['ar', 'fa'],
      div:'select'.prop({onchange:function(){this.dil=this.value;}}),
      model:function(i){
        return 'option'.attr('value',i).set(this[i]);
      },
      ranges:[1],
      scope:''
    },opts); //Ön tanımlı seçenekler
    var def=O.Disk._lang||opts.lang||navigator.language.substr(0,2).toLowerCase();
    if(!opts[def]){
      def=Object.keys(opts.langs)[0];
    }
    var l,t;
    if((l=O.Disk._lTime)&&(t='otag[i18n]'.get()).length){
      t=t[0].attr('i18n'),
      t=t.indexOf(',')==-1?Number(t):t.split(',').map(Number);
      var rem=[];
      opts.ranges.forEach(function(i,j){
        if((typeof l=='number'?l:l[j])<(typeof t=='number'?t:t[j])){
          rem=rem.concat(Object.keys(opts.langs).map(function(l){return '_l'+l+(j||'')+(opts.scope||'')}));
        }
      });
      O.Disk.rem(rem);
      console.log(rem);
    }
    opts.model=opts.model.bind(opts.langs);
    return O.i18n=opts.div
    .has(
      Object.keys(opts.langs).reduce(function(s,i){
        s[i]=opts.model(i);
        return s;
      },{}))
    .prop({
      _:opts,
      onchange:function(){
        this.dil=this.value;
      },
      get:function(phrase){
        let e=this;
        return new Promise(function(res,rej){
          e.ready.then(function(){
            var phr=Math.floor(phrase);
            phrase=Math.round(phrase%1*10);
            if(e._.phr[phr]){
              res(e._.phr[phr].split('=')[phrase]);
            }else{
              rej();
            }
  
          });
        });
      },
      refresh:function(){
        ('[phrase]').get().map(O.F.each('Lang'));
      },
      ready:new Promise(function(res,rej){
  
        let i=setInterval(function(){
          let c=O.i18n._;
          if(c.r?(c.r==c.ranges.length):c.phr&&Object.keys(c.phr).length){
            clearInterval(i);
            res(1);
            O.i18n.dil=c.lang;
          }
        },100);
      })
    }).resp({
    dil:function(dil){
      this.View[dil].selected=true;
      O.Disk._lang=dil;
      O.ready.then(b=>b.Class('rtl',O.i18n._.rtl.indexOf(O.Disk._lang)==-1));
      let e=this,c=e._,set=function(res){
        c.lang=dil;
        O.Disk['_l'+c.lang+(this[1]||'')+e._.scope]=res;
        res=res.split('\n');
        if(e._.map){res=res.map(e._.map);}
        res.forEach(function(i,j){
          c.phr[j+this]=i;
        },this[0]||1);
        if(this[2]=='net'){
          var t=O.Disk._lTime||Array.from({length:c.ranges.length}).map(function(){return 0});
          t[this[1]]=O.Time.now;
          O.Disk._lTime=t;
        }
        c.r++;
        e.refresh();
      };
      e.refresh();
      c.phr=null;
      if(c.path){
        var res;
        c.phr={};
        (c.ranges||[1]).forEach(function(i,j){
          if(res=O.Disk['_l'+dil+(j||'')+e._.scope]){
            set.call([i,j],res);
          }else{
            O.req(this.vars({lang:dil,part:j,scope:e._.scope})).then(set.bind([i,j,'net']));
          }
          
        },c.path);
      }else{
        c.lang=dil;
      }
      //this.View[this.dil].selected=false;
      
    }}).prop({dil:def});
  }, 
  /*
    Nesne={a:1,b:2,_:'b,a'};
    Nesne={a:1,b:2,_:['b','a']};
    O.toArray(Nesne); // [2,1]

    Nesneleri Diziye Dönüştürür
  */
  toArray:function(obj){
    return (obj._?((typeof obj._ =='string')?obj._.split(','):obj._):Object.keys(obj)).map(function(i){return obj[i];});
  },
  proto:{
    Element:{
      /*
        A=''.has({a:''.has({b:''})})
        A.V('a:')   // {a:''.has({b:'B'})}   //Nesne Bağ Haritası
        A.V('a:b')  //<div class="B"></div>  //Öge

        Ögenin alt Ögelerini getirir, (verilen yolda) 
      */
      V:function(path){
        return (path||'').split(':').reduce(function(s,i){
          return s?(i==''?s.View:(s.View[i]?s.View[i]:null)):null;
        },this)
      },
      p:function(top){
        var s=this;
        while(top--){
          s=s.parent;
        }
        return s;
      },
      // tanıma duyarlı özellik tanımlar
      resp:function(prop,f){
        return O.resp.call(this,prop,f);
      },
      // barındırılan özellik tanımlar
      stor:function(prop,key){
        return O.stor.call(this,prop,key);
      },
      /*
        String.prototype.extends incele
      */
      extend:function(component,args){
        if(O.UI[component]){
          return O.UI[component].apply(this,args||[]);
        }else{
          console.warn('₺'+component,'is not defined');
          return this;
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
      destroy:function(after,dur){
        let s=this;
        return new Promise(function(res){
          
          setTimeout(function(){
            setTimeout(function(){s.remove();res();},dur||300);
            s.Class('destroy');
          },after||0);
        });
      },
      interval:function(f,t,args,start){
        if(this._interval){
          clearInterval(this._interval);
        }
        if(f=='stop'){return this;}
        if(typeof f =='function'){
          this.__interval=[function(i,a){f.apply(i,a||[]);},t,this,args];
          this.__iParams=[f,args||[],t];
        }
        if(start||f=='start'){
          this._interval=setInterval.apply(window,this.__interval);;
          this.__iParams[0].apply(this,this.__iParams[1]);
        }
        return this;
      },
      /*
        Öge='Öge'.disp( );      // Gizle
           Öge .disp(0);      // Gizle
           Öge .disp(1);      // Göster
           Öge .disp(1==1);   // Göster
     
        Öge'yi gösterir/gizler
      */
      disp:function(bool){
        if(!bool&&!this.hasOwnProperty("dispState")){
          this.dispState=this.style.display;
        }
        this.style.display=bool?this.dispState:"none";
        return this;
      },
      /*
        Öge='Öge'.has({a:1});
        Öge.a                    // 1

        Öge'ye özellik tanımlar
      */
      prop:function(k,val,attr){
        var e;
        if(val==null&&!(k instanceof Object)||(k instanceof Array)){
          if(k instanceof Array){
            e={};
            k.map(function(i){
              e[i]=attr?this.getAttribute(i):this[i];
            },this);
          }else{
            e=attr?this.getAttribute(k):this[k];
          }
        }else{
          e=this;
          if(attr){
            
            if(!(k instanceof Object)){
              k={[k]:val};
            }
            Object.keys(k).forEach(function(i){
              e.setAttribute(i,k[i]);
            });
          }else{
            if(k instanceof Object){
              Object.keys(k).forEach(function(i){
                if(typeof(k[i])=='function'){k[i]=k[i].bind(e);}
              });
              O.combine(this,k);
            }else{
              this[k]=val;
            }
          }
        }
        return e;
      },
      /*
        Öge='Öge'.Class(['a','b']); // a,b ekle
           Öge .Class('c');       // c ekle
           Öge .Class('b',1);     // b kaldır
        <div class="Öge a c"></div>

        Öge'ye Sınıf ekler/kaldırır
      */
      Class:function(c,r){
        if(!(c instanceof Array)){
          c=[c];
        }
        if(c[0]&&c[0]!=''){
          this.className=c.reduce(function(a,b){
            a=a.replace(new RegExp("(\\b"+b+")+"),"");
            return (r?a:(a+" "+b)).replace(/\s{2}/g," ").trim();
          },this.className);
        }
        return this;
      },
      // Kullanıcı arayüzü şablonu oluşturur
      layout:function(lay,master){
        let s=master||this;
        this.innerHTML='';
        return this.append(
          lay.map(function(i){
            if(i instanceof Element){
              return i;
            }else if(i instanceof Array){
              return i[0].layout(i[1],s);
            }else{
              return s.V(i)||i.init();
            }
          })
        );
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
      do:function(method,on,args){
        if(arguments[3]){args=O.toArray(arguments).splice(2);}
        return this.prop('on'+(on||'click'),function(){
          this.parent[method].apply(this.parent,args||[]);
        });
      },
      /*
        a='a'.init(),b='b'.init();
        Öge='Öge'.append([a,b]);    // a,b ekle
        <div class="Öge"><a></a><b></b></div>

        Öge='Öge'.append([a,b],1);  // a,b ekle, ama tersten
        <div class="Öge"><b></b><a></a></div>       
    

        Öge'ye alt Öge ekler
      */
      append:function(e,rev,delay){
        if(e){
          if(!(e instanceof Array)){
            e=[e];
          }else if(e[0] instanceof Array){
            e=e.map(function(i){
              return 'd'.append(i);
            });
          }
          if(rev){
            e=e.reverse();
          }
          e.forEach(function(i){
            if(!(i instanceof Node)){i=i.init();}
            this.appendChild(i);
          },this);
        }
        return this;
      },
      /*
        
        Öge='Öge'.has({a:'a',b:'b'});
        Öge.View.a              //<a></a>
        Öge.View.a.parent       //<div class="Öge">..

        <div class="Öge"><a></a><b></b></div>
    

        Öge'ye alt öge ekler, arasını bağlar
      */
      has:function(e,before){
        if(e){
        if(!this.View){this.View={};}
        if(e instanceof Array && !(e[0] instanceof Element)){
          var a=[];
          for(var i in e){
            a.push("d".has(e[i]));
            e[i].parent=this;
            O.combine(this.View,e[i]);
          }
          e=a;
        }
        if(typeof e!='object'||e instanceof Element){
          e=[e];
        }
        if(e instanceof Object){
          var arr=[];
          //add sort function feature
          e=(e._?(typeof e._ =='function'?Object.keys(e).filter(function(i){
            return e[i] instanceof Element;
          }).sort(e._):e._):Object.keys(e)).map(function(i){
            if(typeof e[i] =='function'){
              e[i]=e[i]();
            }
            return (this.View[i]=e[i].prop({parent:this}));
          },this);
        }}
        return this.append(e,before);
      },
      html:function(e){
        this.innerHTML="";
        return e?this.has.apply(this,arguments):this;
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
      Lang:function(i,phr){
        i=i||this.attr('phrase')||this.prop('phrase');
        let s=this;

        s.attr('phrase',i);
        if(phr){
          s.prop('phr'+(typeof phr =='function'?'Select':''),phr);
        }
        if(this.phr&&this.phrSelect){
          i=Number(i)+this.phrSelect(this.phr)/10;
        }
        let type=this.attr('t')||this.t
        O.i18n.get(i).then(function(p){

          if(s.phr){
            if(!(s.phr instanceof Object)){
              s.phr=[s.phr]
            }
            p=p.vars(s.phr);
          }
          if(s.ttl){
            s.title=p;
          }
          if(['title','placeholder'].indexOf(type)>-1){
            s.attr(type,p);
          }else{
            s.innerHTML=p;
          }
        });
        return s;
      },
      setSafe:function(t,phr){
        let rep=function(str){
          if(typeof str =='string'){
            str=str.replaceAll(
              [/&/g,
              /</g,
              />/g,
              /"/g,
              /'/g],
              ["&amp;",
              "&lt;",
              "&gt;",
              "&quot;",
              "&#039;"]
            )
          }
          return str;
        }
        return this.set(rep(t),rep(phr));
      },
      /*
        Öge='Öge'.set('Esenlikler ad₺!',{ad:'Yertinç'});
        <div class="Öge">>Esenlikler Yertinç!</div>

        Öge.set({ad:'Otağ'});
        Öge.val                 // {ad:'Otağ'});
        <div class="Öge">Esenlikler Otağ!</div>
    
        Öge'nin içine yazı yazar
      */
      set:function(t,phr){
        if(t&&!phr){
          let phrase;
          if(phrase=this.attr('phrase')){
            if(!(t instanceof Object)){
              t=[t];
            }
            this.phr=t;
            //console.log(1);
            this.Lang(phrase,t);
          }else if(t instanceof Object){
            if(!this.main){this.main=this.innerHTML;}
            if(t._){
              this.innerHTML="";
              this.append(this.main.varsX(this.data=t));
            }else{
              this.innerHTML=this.main.vars(this.data=t).replace(/\n/gm,'<br>');
            }
          }else{
            this.innerHTML=String(t).replace(/\n/gm,'<br>');
          }
        }else if(t){
          if(isFinite(t)){
            this.Lang(t,phr==1?null:phr);
          }else{
            this.main=t;
            if(phr._){
              this.innerHTML="";
              this.append(this.main.varsX(this.data=phr));
            }else{
              this.innerHTML=this.main.vars(this.data=phr).replace(/\n/gm,'<br>');
            }
          }
        }else{
          this.innerHTML='';
        }
        return this.Class('def',1);
      },
      /*

        Öge='Öge'.has({a:'a',b:'b'});
        Öge.setView({a:'Esenlikler',b:'Yertinç'})

        <div class="Öge"><a>Esenlikler</a><b>Yertinç</b></div>
    

        Öge'nin alt ögelerine değer verir.
      */
      setView:function(d){
        let v=this.View;
        //this.data=O.combine(this.data||{},d);
        if(this.ondata){this.ondata(d);}
        (d._||Object.keys(d)).forEach(function(i){
          if(v.hasOwnProperty(i)){
            v[i].set(d[i]);
          }
        });
        return this;
      },
      /*

        Öge='Öge'.atttr({ni:'te',li:'k'});
        

        <div class="Öge" ni="te" li="k"></div>
    

        Öge'ye nitelik tanımlar
      */
      attr:function(k,v){
        return this.prop.apply(this,[k,v,'attr']);
      },
      link:function(addr,href){

        this.href=href||addr;
        this.addr=addr;
        if(addr.indexOf('//')==-1&&!this.onclick){
          this.onclick=function(e){
            e.preventDefault();
            if(O.Page!='function'){
              O.Page.route(this.addr,1);
            }
          }
        }
        return this;
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
      connect:function(source,on,nav){
        if(!source){
          throw Error(".connect requires a data source. https://otagjs.org/#/belge/.connect");
        }
        on=on||'oid';
        let f=(source instanceof Element
          ?function(ch){
            this.val=source.val;
          }    
          :function(ch){
            let d = source instanceof Function?source(ch):source[ch];
            f = (function(d){ this.val=d;}).bind(this);
            if(d instanceof Promise){
              let s=this;
              d.then(f)
            }else{
              f(d);
            }
          }).bind(this);
        
        if(nav){
          let range=null;
          if(nav instanceof Object&&nav.range){
            range=nav.range;
          }
          this.prop({
            dataNav:function(to){
              if(this.source[to]){
                let p=this.source[to]
                ,   f=(function(p){
                    this[on]=p;
                  }).bind(this);
                if(typeof p=='function'){
                  p=p();
                  p instanceof Promise?p.then(f):f(p);
                }else{
                  f(p);
                }
              }else{
                let r = range||[0,this.source.length-1]
                ,   i = this[on];
                i=to=='prev'?i-1:i+1;
                if(i<r[0]){
                  i=r[1];
                }else if(i>r[1]){
                  i=r[0];
                }
                this[on]=i;
              }
              return this;
            },
            next:function(){
              return this.dataNav('next');
            },
            prev:function(){
              return this.dataNav('prev');
            }
          })
        }
        this.prop('source',source).resp(on,f);
        return this;
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
      valid:function(validationMap,invalidCallback){
        this._validator=validationMap;
        this._invalid=invalidCallback;
        return this;
      }
    },
    String:{
      
      /* 
        '.CSS.Seçici'.get() // [Öge,Öge..]
        '#Kimlik'.get() // Öge

        Belgedeki Ögeleri getirir
      */
      get:function(index){
        let s=this+'',d=O._selector(s);
        if(d.args.length||d.ui){throw new Error('Module and argument selector is not available');}
        var th=O.toArray(document.querySelectorAll(this+''));
        
        if(d.id){
          index=0;
        }
        if(index!=null){
          th=th[index];
        }
        return th;
      },
      /* 
        '.CSS.Seçici'.init() // <div class="CSS Seçici"></div>

        ₺Bileşen çağırır / ₺M:Model çağırır / Öge oluşturur.
      */
      init:function(){
        let s=this+'',d=O._selector(s);
        if(d.ui){
          if(!O.UI[d.ui]){console.log(d.ui,'is not defined')};
          d.el=O.UI[d.ui].apply(d.ui,d.args.concat(O.toArray(arguments)));
        }else{
          d.el=document.createElement(d.el||'div');
        }
        //Eğer kodunuz burada patlıyorsa, ₺Bileşen'i doğru oluşturmamışsınız demektir. ₺Bileşen Öge döndürmeli.
        d.el.Class(d.class).attr(d.attr);
        if(d.id){
          d.el.id=d.id;
        }
        if(d.el.tagName=='INPUT'){
          d.el.addEventListener('keyup',function(e){if(e.keyCode==13&&this.enter){this.enter(this.value)}})
        }
        if(!d.el.View){d.el.View={};}
        return d.el;
      },
      /* 
        '#ResimKutusu'.extends('Bediz')

        Bileşeni belgede bulunan Ögeler ile çağırır.
      */
      extends:function(){
        let e=(this+'').get();
        if(e instanceof Array){
          return e.map(O.F.each('extend',O.toArray(arguments)))
        }else{
          return e.extend.apply(e,arguments);
        }
      },
      /* 
        'o,t,a,g'.from({g:2,o:'bc',a:5,t:5,y:2017}).join('') // 'bc552'

        Nesneden belirli özelliklerin değerlerini sırayla getirir. Dizi oluşturur
      */

      from:function(obj){
        let r= (this=='*'?Object.keys(obj):this.split(',')).map(function(i){return obj[i]});
        return (this.indexOf(',')==-1&&this!="*")?r[0]:r;
      },
      /* 
        Öge='Öge'.has({a:'a'.prop('value',1),b:'b'.prop('value',2)});
        'a,b'.val(Öge)       // [1,2]
        'a,b'.from(Öge.val) // [1,2] aslında bu demektir.

        Öge'nin değerinden istenilen alanları sırayla getirir. Dizi oluşturur
      */
      val:function(obj){
        let r=this.split(',').map(function(i){return this[i]},obj.val);
        return r.length==1?r[0]:r;
      },
      /* 
         nesneyi istenilen alanlara göre keser
         'ad,soyad'.of({ad:'',soyad:'',bediz:''}) => {ad:'',soyad:''}
      */
      of:function(obj){
        return this=='*'?obj:this.split(',').reduce(function(o,i){o[i]=obj[i]||null;return o},{});
      },
      /*
        Diziden nesne yapar
        'ad,soyad,bediz,özellik1'.obj(['koraltan','temren','temren.jpg']) =>
        {ad:'koraltan',soyad:'temren',bediz:'temren.jpg'}
        def girdisine, dizide o indis yoksa belirecek öntanımlı değer girebilirsiniz
        bu öntanımlı değer hepsi için ortak ya da indise özgü olabilir.
      */
      obj:function(arr,def){
        return this.split(',').reduce(
          def instanceof Array
          //indise özgü öntanımlı
          ?function(n,i,j){
            n[i]=arr[j]||def[j];
            return n;
          }
          //ortak öntanımlı
          :function(n,i,j){
            n[i]=arr[j]||def;
            return n;
          }
        ,{});
      },
      /* 
        'Esenlikler yer₺!'.vars({yer:'Yertinç'}) //Esenlikler Yertinç!

        Değişken₺ tanımlı Yazı'ları işler
      */
      vars:function(vars){
        vars=typeof vars=='object'?vars:arguments;
        return Object.keys(vars).reduce(function(m,v){
          return m.replace(new RegExp("("+v+"[₺|\$|₸|₼])+"),vars[v]);
        },this)
      },
      varsX:function(vars){
        vars=typeof vars=='object'?vars:arguments;
        let v= Object.keys(vars).reduce(function(m,v){
          return m.replace(new RegExp("("+v+"[₺|\$|₸|₼])+"),vars[v] instanceof Element?'|'+v+'|':vars[v]);
        },this).split('|');
        v=v.map(function(i,j){
          return j%2?vars[i]:document.createTextNode(i);

        })
        console.log(v);
        return v;
      },
      replaceAll:function(f,r){
        var s=this;
        for(var i in f){
          while(s.indexOf(f[i])>-1){
            s=s.replace(f[i],r[i]);
          }
        }
        return s;
      }
    },
    Function:{
      /*
        f=function(){}
        f=f.prom();
        f(girdiler).then(tamamlandı)

        İşlevi söze dönüştürür.
      */
      prom:function(){
        let f=this;
        return function(){
          let a=arguments;
          return new Promise(function(res,rej){
            try{
              var r=f.apply(f,a);
              res(r);
            }catch(e){
              rej(e);
            }
            
          })
        }
      },
      /*
        Belirli bir zaman için işlevi sınırlandırır,geciktirir.
      */
      debounce :function(delay) {
        let f=this;
        let inDebounce;
        return function() {
          let a=arguments,s=this;
          clearTimeout(inDebounce);
          inDebounce = setTimeout(function(){
            f.apply(s, a)
          },delay);
          return s;
        }
      }
    },
    Image:{
      set:function(s){
        return this.Class('loading').prop({
          onload:function(){this.Class('loading',1)},
          onerror:function(){this.Class('loading',1).Class('error')}
          ,src:s});
      },
      value:function(){
        return this.src;
      }
    }
  }
};
O.F={
  //. A/B
  // [1,2,3,4].filter(O.Filter.diff([3,4,5])); =>1,2
  diff:function(arr){
    return function(i){
      return arr.indexOf(i)<0
    }
  },
  //A∩B
  // [1,2,3,4].filter(O.Filter.arrHas([3,4,5])); =>3,4
  arrHas:function(arr){
    return function(v){
      return arr.indexOf(v)>-1;
    }
  },
  // [1,2,3,4,5].filter(O.num(2,4)))=>3
  num:function(min,max){
    if(min instanceof Array){
      max=min[1];min=min[0];
    }
    return function(a){
      return (!min||a>min)&&(!max||a<max)
    }
  },
  //Nesne hasOwnProp
  hasProp:function(o){
    return function(p){
      return o.hasOwnProperty(p);
    }
  },
  //regex sınaması
  reg:function(ex){
    ex=new RegExp(ex);
    return function(v){
      return ex.test(v);
    }
  },
  //Yazının başlangıcı
  pref:function(s){
    let l=s.length;
    return function(v){
      return v.substring(0,l)==s;
    }
  },
  // eq'ya eşit mi O.F.eq(1);
  eq:function(eq,eq2,type,cb){
    return arguments.length==1?function(v){
      return v==eq;
    }:(cb?function(v){
      return cb(v[type](eq))==eq2;
    }:function(v){

      return (type='prop'?v[eq]:v[type](eq))==eq2;
    })
  },
  // Dizideki aynı ögeleri sil
  unique:function(v, i, self) { 
    return self.indexOf(v) === i;
  },



  // ögelerin özelik/nitelik değerlerini getir
  value:function(p,cb,attr){
    attr=attr?'attr':'prop';
    return cb?function(v){
      return cb(v[attr](p));
    }:function(v){
      return v[attr](p);
    }
  }
  /*
     aynı girdilerle belirli bir yöntemi çağır
     ['a','b','c'].map(O.Filter.each('prop',{propName:'propValue'}))
  */
  ,each:function(method,args){
    if(!(args instanceof Array)){
      args=[args];
    }
    return function(i){
      if(i[method]){
        return i[method].apply(i,args);
      }
    }
  }
}
O.UI={
  //'₺M:Model' yazımını sağlamak içindir,değiştirmeyin
  M:function(arg){
    let a=O.toArray(arguments);
    return O.Model[a.shift()].apply('',a);
  }
}
Otag.Model={
  //Örnek bir Modeldir, ₺List'te Öntanımlıdır. Çok kullandığınız bir Model'le değiştirebilirsiniz.
  Default:function(i){
    var w = {};
    Object.keys(i)
    .forEach(function(j){
      w[j]=j;
    });
    return 'defaultModel'.has(w).setView(i);
  }
}
Object.keys(O.proto).forEach(function(i){
  O.combine(window[i].prototype||window[i],O.proto[i]);
});
Object.keys(O.proto.Element).forEach(function(i){
  Number.prototype[i]=String.prototype[i]=function(){
    let j=this.init();
    return j[i].apply(j,arguments)
  }
});
delete O.proto;
Object.defineProperties(Element.prototype,{

  val:{
  get:function(){
    if(typeof this.value == 'function'){
      return this.value();
    }
    else if(this.value||this.hasOwnProperty('value')){return this.value;}
    else if(this.View){
      let d={},n=this,v;
      if(Object.keys(this.View).some(function(i){
        if(i[0]!='_'&&!this.View[i].isSameNode(n)){
          if(this._validator&&(v=this._validator[i])){
            if(!(typeof v=='function'?v(this.View[i].val):v.test(this.View[i].val))){
              if(this._invalid){
                this._invalid();
              }
              return true;
            }
          }
          d[i]=this.View[i].val;
        }
        return false;
      },this)){
        return null;
      }else{
        return d;
      }
    }
    else{return this.data||null;}
  },
  set:function(o){
    if(o instanceof Promise){
      let s=this;
      o.then(function(o){
        s.val=o;
      })
    }
    if(this.View){this.setView(o)}else{this.set(o);}}
  }
});