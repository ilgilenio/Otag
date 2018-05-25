    /*    _             _
      o  | |        o  | |                o
     _   |/   __,  _   |/   __  _  __    _    __
      |  |   /  | / |  |   |_/ / |/  |  / |  /  \
      |_/|__/\_/|/  |_/|__/|__/  |   |_/  |_/\__/
              /|
    *         \|    2016-2018 ilgilenio® 
    *               Otag Çatı Çalışması 1.1 kararlı
    *               https://github.com/ilgilenio/Otag/wiki
    *               MIT ile korunmaktadır
    */
    "use strict"
    var O,Otag=O={
        /*
            Geçmiş/Yönlendirme/Sayfalama Yöneticisi
            Belirlediğiniz yollara göre işlev çağırabilirsiniz, yönlendirme yapabilirsiniz
            Öge uyandırabilirsiniz.
            
            Örnek kullanım
            https://ilgilenio.github.io/Otag/ornekler/Atasozleri
        */
        Page:function(opts){
            opts=O.combine({
                routes:{},
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
            opts.routes.none=opts.none;
            Element.prototype.router=function(r){
                return this.resp('route',function(route){
                    if(this.route){
                        delete  O.Page.routes[this.route];
                    }
                    let s=this;
                    O.Page.routes[route]=function(r){
                        s.wake();
                    }
                }).prop('route',r);
            }
            O.Page=O.resp.call({
                routes:opts.routes,
                route:function(hash,push){
                    if(hash instanceof Object){
                        hash=hash.state||'';
                    }
                    var h=hash.split(':');
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
                        if(r.wake){r.wake.apply(r,h);}else{opts.handler(r);}
                    }
                    window.history[(push?'push':'replace')+'State'](hash,null,'#/'+hash)
                }
            },{now:function(now){
                // Önceki Beti atıl duruma sok
                if(this.now&&this.now.idle){
                    this.now.idle();
                }
                this.title.set({page:now.name||''});
            }});
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
        Page4:function(opts){
            opts=O.combine({
                routes:{},
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
                Nav:'Nav'.init(),
                routes:new Proxy({},{
                    set:function(o,k,v){
                        o[k]=v;
                        if(v instanceof Element&&k!='none'){
                            O.Page.Nav.append('a'.link(k).set(v.name));

                        }
                        return true;
                    },
                    get:function(o,k){
                        return o[k]?o[k]:null;
                    }
                }),
                routeComplete:function(bet,args){
                    /*let bet1;
                    if(bet1=this.routes[bet]){
                        if(bet1.wake){bet1.wake.apply(bet1,args);}
                        this.now=bet1;
                    }else{
                        if(opts.fallback){
                            opts.fallback()
                        }
                    }*/
                },
                route:function(hash,push){
                   /* if(hash instanceof Object){
                        hash=hash.state||'';
                    }
                    if(opts.resolver){
                        opts.resolver(hash).then(this.routeComplete);
                    }*/
                    if(hash instanceof Object){
                        hash=hash.state||'';
                    }
                    var h=hash.split('/');
                    if(h[0]=='#'){h.shift();}

                    console.log(h);
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
                        if(r.wake){r.wake.apply(r,h);}else{opts.handler(r);}
                    }
                    window.history[(push?'push':'replace')+'State'](hash,null,'#/'+hash)
                }
            },{now:function(now){
                // Önceki Beti atıl duruma sok
                if(this.now&&this.now.idle){
                    this.now.idle();
                }
                this.title.set({page:now.name||''});
            }});

            Object.keys(opts.routes).forEach(function(v){
                O.Page.routes[v]=opts.routes[v];
            })
            let init=function(){
                var title;
                if(!(title='title'.get()).length){
                    document.head.append(title=['title'.init()])
                }
<<<<<<< HEAD
                if(title[0].innerHTML.indexOf('page₺')==-1){
                    title[0].set('page₺')
=======
                let r,r1=h.shift(),dgsk;
                if(!(r=this.routes[r1])){
                   if(opts.regkeys){
                     let bu=this;
                     Object.keys(this.routes).reduce(function(t,n){
                       if(n.match(/^[\/\#\@](.+)[\/\#\@]$/)){
                         dgsk=new RegExp(n.replace(/^([\/\#\@])/, '^').replace(/([\/\#\@])$/, '\/*$')).exec(r1);
                         if(dgsk){dgsk.shift();r=bu.routes[n];}
                         else r=bu.routes.none;
                       }else r=bu.routes.none;
                     })
                   }else r=this.routes.none;
>>>>>>> ae52d7b67d0712ef6b084eef2a211bfa8cd0fbfd
                }
                
                this.title=title[0];
                this.route(decodeURI(location.hash.substring(2)),1);
                window.onpopstate=this.route.bind(this);
            };
            O.ready.then(init.bind(O.Page));
            return O.Page;
        },
        Page2:function(opts){
            opts=O.combine({
                routes:{},
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
            opts.routes.none=opts.none;
            Element.prototype.router=function(r){
                return this.resp('route',function(route){
                    if(this.route){
                        delete  O.Page.routes[this.route];
                    }
                    let s=this;
                    O.Page.routes[route]=function(r){
                        s.wake();
                    }
                }).prop('route',r);
            }
            O.Page=O.resp.call({
                routes:opts.routes,
                route:function(hash,push){
                    if(hash instanceof Object){
                        hash=hash.state||'';
                    }
                    var h=hash.split(':');
                    if(h[0]==''&&this.routes.index){
                        return this.route('index');
                    }
                    let r,r1=h.shift(),dgsk;
                    if(!(r=this.routes[r1])){
                       if(opts.regkeys){
                         let bu=this;
                         Object.keys(this.routes).reduce(function(t,n){
                           if(n.match(/^[\/\#\@](.+)[\/\#\@]$/)){
                             dgsk=new RegExp(n.replace(/^([\/\#\@])/, '^').replace(/([\/\#\@])$/, '\/*$')).exec(r1);
                             if(dgsk){dgsk.shift();r=bu.routes[n];}
                             else r=bu.routes.none;
                           }
                         })
                       }else r=this.routes.none;
                    }
                    if(typeof r=='string'){return this.route(r);}
                    if(typeof r=='function'){r.apply(null,h);}
                    if(r instanceof Element){
                        this.now=r;
                        if(r.wake){r.wake.apply(r,[dgsk,h]);}else{opts.handler(r);}
                    }
                    window.history[(push?'push':'replace')+'State'](hash,null,'#/'+hash)
                }
            },{now:function(now){
                // Önceki Beti atıl duruma sok
                if(this.now&&this.now.idle){
                    this.now.idle();
                }
                this.title.set({page:now.name||''});
            }});
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
        Page3:function(opts){
            opts=O.combine({
                routes:{},
                none:"Bulunamadı".prop({
                   name: 'Bulunamadı'
                }).layout([
                   ["center", [
                    'h1'.set('Bet Bulunamadı'),
                    'p'.set("Aradığınız bet bulunamadı")
                   ]]
                ]),
                initialResolver:function(loc){
                    // belge yüklendiğinde #/betadı şeklindeki bulunağı çözümler
                    return decodeURI(location.hash.substring(2))
                },
                /* bu işlev bir söz olmalı çözüm olarak 3 alanlı dizi döndürmelidir:
                 * [
                 *   Belirlenen Bet,            * örn: kullanıcı
                 *   Beti uyandırma girdileri,  *      123, yazılar
                 *   URLde çıkacak tam yol      *      #/kullanıcı/123/yazılar
                 * ]
                 */
                resolver:(function(hash){
                    // #/betadı şeklinde url döndürür
                    var page,
                    fullpath='#/'+hash,
                    args=hash.split(':');
                    if(r=O.Page.routes[args.shift()]){
                        r={bet:r,args:args,fp:fullpath,hash:hash}
                    }else{
                        r={bet:r,args:[],fp:fullpath,hash:'none'}
                    };
                    return r;
                }).prom(),
                handler:function(Oge){
                    document.body.html(Oge);
                }
            },opts||{});
            opts.routes.none=opts.none;
            Element.prototype.router=function(r){
                return this.resp('route',function(route){
                    if(this.route){
                        delete  O.Page.routes[this.route];
                    }
                    let s=this;
                    O.Page.routes[route]=function(r){
                        s.wake();
                    }
                }).prop('route',r);
            }
            let resolveComplete=(function(r){
                if(r){
                    if(typeof r=='string'){
                        this.route(r);
                    }else if(r instanceof Object){
                        r.bet.wake.call(r.bet,r.hash);
                        window.history[(push?'push':'replace')+'State'](r.hash,null,r.fp)
                    }
                } if(r instanceof Element){
                        this.now=r;
                        if(r.wake){r.wake.apply(r,args);}else{opts.handler(r,args);}
                    }
            }).bind(this)
            O.Page=O.resp.call({
                routes:opts.routes,
                route:function(hash,push){

                    if(hash instanceof Object){
                        hash=hash.state||'';
                    }
                    if(['/',''].indexOf(hash)>-1&&this.routes.index){
                        return this.route('index');
                    }
                    if(!(r=this.routes[hash])){
                        return opts.resolver(hash).then(resolveComplete).catch(function(){
                            resolveComplete(false);
                        });
                    }else{
                        resolve({r:1});
                    }
                    
                }
            },{now:function(now){
                // Önceki Beti atıl duruma sok
                if(this.now&&this.now.idle){
                    this.now.idle();
                }
                this.title.set({page:now.name||''});
            }});
            let init=function(){
                var title;
                if(!(title='title'.get()).length){
                    document.head.append(title=['title'.init()])
                }
                if(title[0].innerHTML.indexOf('page₺')==-1){
                    title[0].set('page₺')
                }
                
                this.title=title[0];
                this.route(this.initialResolver(location),1);
                window.onpopstate=this.route.bind(this);
            };
            O.ready.then(init.bind(O.Page));
            return O.Page;
        },
        Sock:function(opts){
            opts=O.combine({
                url:'/',
            },typeof opts =='string'?{url:opts}:(opts||{}));
            
            var yuva;
            var conn = function(){
              yuva = new WebSocket(opts.url.startsWith('ws://') ? opts.url : 'wss://'+opts.url);
            };
            conn();
            let olay;

            yuva.addEventListener('message', function (event) {
                let veri = event.data.split(",")
                olay = veri[0];
                veri.shift();
                yuva.dispatchEvent(new MessageEvent(olay, {data: veri.join(",")}));
            });

            yuva.addEventListener('close', function(ev){
              conn();
            })
            return yuva;
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
        }
        /*
            O.ready.then(body=> )
        
            Belge yüklenince çözümlenecek bir Söz döndürür,
        */
        ,ready:new Promise(function(res,rej){
            document.addEventListener('DOMContentLoaded',function(){
                res(document.body);
            });
        })
        ,_selector:function(s){
            var d= {
                class:/\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,
                attr:/\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9.-_şŞüÜöÖçÇİığĞ]+)"\]/g,
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
        }
        ,_selector2:function(s){

            var d= ['div'].concat([
                /\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,
                /\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9.-_şŞüÜöÖçÇİığĞ]+)"\]/g,
                /\#([0-9A-Za-z\-_şŞüÜöÖçÇİığĞ]+)/,
                /[\$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,
                /\:(\w+)/g
            ].map(function(r,j){
                if(typeof r =='string'){return r;}
                var l=j==1?{}:[],rm=[],e,i=-1;

                while((e=r.exec(s))&&r.lastIndex!=i){
                    rm.push(e[0]);
                    i=r.lastIndex;
                    if(j==1){
                        l[e[1]]=e[2];
                    }else{
                        l.push(e[1]);
                    }
                }
                rm.forEach(function(i){
                    s=s.replace(i,'');
                });
                return l;
            }));
            let e;
            if(e=/^[a-zşüöçığ][a-zşüöçığ0-9]+$/g.exec(s)){
                s=s.replace(d[0]=e[0],'');
            }
            if(s.length){
                d[1]=d[1].concat(s.split(' '))
            }
            return d;
        }
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
            backend:'/',
        }
        /*
            O.Time.now       Şimdi (UNIX zamanı) sn cinsinden verir.
            O.Time.yesterday Dünün ilk sn verir.

        */
        ,Time:new Proxy({
            yesterday:864e5,
            today:0,now:0,
            tomorrow:-864e5
        },{get:function(a,b,c){
            let t=new Date(+new Date-a[b]);
            if(b!='now'){
                t.setHours(0);
                t.setMinutes(0);
                t.setSeconds(0);
            };return Math.floor(t.getTime()/1000)}})
        /*
            O.Disk.açar = 'değer'
            O.Disk.açar             // 'değer'
            delete O.Disk.açar

            Yerel Yığınağa bilgi yazmak/okumak/silmek için kullanılır.
        */
        ,Disk:typeof Storage!="undefined"?new Proxy({available:true,expire:function(key,time){
                O.Disk[key+':expire']=O.Time.now+Number(time);
            },rem:function(k){
                if(typeof k=='string'){k=[k];}
                k.forEach(function(i){
                    localStorage.removeItem(i);
                });
        }},{
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
        }
        /*
            O.req('veritabanı',{kimlik:''}).then(f(cevap))
            ep:     uçnokta,    YAZI
            data:   veri,       NESNE

            AJAX isteği yapar; data boş ise GET, dolu ise POST isteği yapar.
            Söz döndürür.

        */
        ,req:function(ep,data,upload){
            var XHR=new XMLHttpRequest();
            
            //backend+endpoint
            XHR.open(data?'POST':"GET",ep.indexOf('/')>-1?ep:(O._conf.backend+ep),true);
            XHR.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            var s=function(obj, pr) {
                var str = [];
                for(var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                    var k = pr ? pr + "[" + p + "]" : p, v = obj[p];
                    str.push(typeof v == "object" ?s(v, k) :encodeURIComponent(k) + "=" + encodeURIComponent(v));
                    }
                }
                return str.join("&");
            };
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
                s=data?s(data):'';
                XHR.send(s);
            });     
        }
        /*
            Uluslararasılaştırma(U18A) Betliği
        */
        ,i18n:function(opts){
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
        }
        
        /*
            Nesne={a:1,b:2,_:'b,a'};
            Nesne={a:1,b:2,_:['b','a']};
            O.toArray(Nesne); // [2,1]

            Nesneleri Diziye Dönüştürür
        */
        ,toArray:function(obj){
            return (obj._?((typeof obj._ =='string')?obj._.split(','):obj._):Object.keys(obj)).map(function(i){return obj[i];});
        }
        ,proto:{
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
            //create UI layout
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
            layout2:function(lay,master){
                let s=master||this;
                this.innerHTML='';
                return this.append(
                    (lay._||Object.keys(lay)).map(function(i){
                        if(lay[i] instanceof Element){
                            return lay[i];
                        }else if(lay[i] instanceof Object){
                            return i.layout2(lay[i],s);
                        }else{
                            return s.V(lay[i])||lay[i].init();
                        }
                    })
                );
            },
            do:function(method,on,args){
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
                if(typeof t =='string'){
                    t=t.replaceAll(
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
                if(typeof phr =='string'){
                    phr=phr.replaceAll(
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
                return this.set(t,phr);
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
                            this.innerHTML=this.main.vars(this.data=t);
                        }
                    }else{
                        this.innerHTML=t;
                    }
                }else if(t){
                    if(isFinite(t)){
                        this.Lang(t,phr==1?null:phr);
                    }else{
                        this.main=t;
                        /*let e,r,i;
                        if((r=/(\:[0-9A-Za-zşŞüÜöÖçÇİığĞ]+)+/g).test(t)){
                            r=new RegExp(r);
                            let j=0;
                            while((e=r.exec(t))&&r.lastIndex!=i){
                                i=r.lastIndex;
                                if(this.V(e[0].substring(1))){
                                    t= t.replaceAll(e[0],j+'__₺');
                                    phr[(j++)+'__']=this.V(e[0].substring(1));
                                }
                            }
                            if(j){phr._=1};
                        }*/
                        if(phr._){
                            this.innerHTML="";
                            this.append(this.main.varsX(this.data=phr));
                        }else{
                            this.innerHTML=this.main.vars(this.data=phr);
                        }
                    }
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
                if(!this.onclick){
                    this.onclick=function(e){
                        e.preventDefault();
                        if(O.Page!='function'){
                            O.Page.route(this.addr,1);
                        }
                    }
                }
                return this;
            },
            subs:function(_activator){
                O._R.push(this);
                return this;
            }
        },
        String:{
            
            /* 
                '.CSS.Seçici'.get() // [Öge,Öge..]
                '#Kimlik'.get() // Öge

                Belgedeki Ögeleri getirir
            */
            get:function(){
                let s=this+'',d=O._selector(s);
                if(d.args.length||d.ui){throw new Error('Module and argument selector is not available');}
                var th=O.toArray(document.querySelectorAll(this+''));
                
                if(d.id){
                    th=th[0];
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
                    if(!O.UI[d.ui]){console.log(ui,'is not defined')};
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
            init2:function(){
                let s=this+'',d=O._selector2(s);
                if(d[4].length){
                    if(!O.UI[d[4]]){console.log(d[4],'is not defined')};
                    d[0]=O.UI[d[4]].apply(d.ui,d[5].concat(O.toArray(arguments)));
                }else{
                    d[0]=document.createElement(d[0]||'div');
                }
                //Eğer kodunuz burada patlıyorsa, ₺Bileşen'i doğru oluşturmamışsınız demektir. ₺Bileşen Öge döndürmeli.
                d[0].Class(d[1]).attr(d[2]);
                if(d[3].length){
                    d[0].id=d[3][0];
                }
                if(d[0].tagName=='INPUT'){
                    d[0].addEventListener('keyup',function(e){if(e.keyCode==13&&this.enter){this.enter(this.value)}})
                }
                if(!d[0].View){d[0].View={};}
                return d[0];
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
                let r=this.split(',').map(function(i){return obj[i]});
                return r.length==1?r[0]:r;
            },
            /* 
                Öge='Öge'.has({a:'a'.prop('value',1),b:'b'.prop('value',2)});
                'a,b'.of(Öge)       // [1,2]
                'a,b'.from(Öge.val) // [1,2] aslında bu demektir.

                Öge'nin değerinden istenilen alanları sırayla getirir. Dizi oluşturur
            */
            of:function(obj){
                let v=obj.val;
                let r=this.split(',').map(function(i){return v[i]});
                return r.length==1?r[0]:r;
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
                this.src=s;
                return this;
            },
            value:function(){
                return this.src;
            }
        },
        WebSocket: {
          on: function(trig,cb){
              let bu = this;
              if(typeof trig=='string'){
                  trig={[trig]:cb};
              }
              return Object.keys(trig).forEach(function(e){
                  bu.addEventListener(e,trig[e]);
              });
              return this;
          },
          emit: function(o,v){
            return this.send(o+","+(typeof v == 'object'?JSON.stringify(v):v))
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
                let d={},n=this;
                Object.keys(this.View).forEach(function(i){
                    if(i[0]!='_'&&!this[i].isSameNode(n)){d[i]=this[i].val;}
                },this.View);
                return d;
            }
            else{return this.data||null;}
        },
        set:function(o){if(this.View){this.setView(o)}else{this.set(o);}}}
    });
