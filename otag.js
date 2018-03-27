/*   _             _
 o  | |        o  | |                o
_   |/   __,  _   |/   __  _  __    _    __
 |  |   /  | / |  |   |_/ / |/  |  / |  /  \
 |_/|__/\_/|/  |_/|__/|__/  |   |_/  |_/\__/
          /|
*         \|    2016-2018 ilgilenio® 
*               Otag Çatı Çalışması 1.0.0
*               https://github.com/ilgilenio/Otag/wiki
*               MIT ile korunmaktadır
*/
"use strict"
var O,Otag=O={
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
            obj=obj||this;
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

        Bir nesneye tanıma duyarlı özellik tanımlar
    */
    resp:function(prop,f){
        if(typeof prop=='string'){
            prop={[prop]:f};
        }
        let e=this||{};
        Object.defineProperties(e,Object.keys(prop).reduce(function(s,p){
            let f=prop[p];
            if(e[p]){e['_'+p]=e[p];}
            s[p]={
                get:function(){
                    return this['_'+p];
                },
                set:function(val){
                    if(val!=this[p]){
                        f.call(this,val);
                        this['_'+p]=val;
                    }
                }
            };
            return s;
        },{}));
        return e;
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
        //tag,class,attr,id,module,argument
        var latin='([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)';
        /*var d=['\\.0₺','\\[0₺="1₺"\\]','#0₺','[\\$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)','\\:(\\w+)'].reduce(function(d,i){return d.concat(new RegExp(i.vars([latin,latin]),'g'))},['div'])
        */var d= [
            'div',
            /\.([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/g,
            /\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9.-_şŞüÜöÖçÇİığĞ]+)"\]/g,
            //new RegExp('#'+latin),
            /\#([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)/,
            /[\$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,
            /\:(\w+)/g
        ].map(function(r,j){
            if(typeof r =='string'){return r;}
            var l=j==2?{}:[],rm=[],e,i=-1;

            while((e=r.exec(s))&&r.lastIndex!=i){
                rm.push(e[0]);
                i=r.lastIndex;
                if(j==2){
                    l[e[1]]=e[2];
                }else{
                    l.push(e[1]);
                }
            }
            rm.forEach(function(i){
                s=s.replace(i,'');
            });
            return l;
        });
       if(d[4].length==1){
          d[0] = "div";d[1].push(d[4][0]);
       }else{
        if(!isFinite(s)&&s.length){
            if(['[','#','.'].indexOf(s[0])==-1){
                let i=Math.min.apply(Math,['[','#','.'].map(function(i){i=s.indexOf(i);return i==-1?Infinity:i;}))
                d[0]=s.substr(0,i);
                s=s.substring(i);
            }
        }
       }
        return d;
    },
    /*
        Model ve Bileşen tanımlamak içindir.
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
        let D=new Date(+new Date-a[b]);
        if(b!='now'){
            D.setHours(0);
            D.setMinutes(0);
            D.setSeconds(0);
        };return Math.floor(D.getTime()/1000)}})
    /*
        O.Disk.açar = 'değer'
        O.Disk.açar             // 'değer'
        delete O.Disk.açar

        Yerel Yığınağa bilgi yazmak/okumak/silmek için kullanılır.
    */
    ,Disk:typeof Storage!="undefined"?new Proxy({available:true,rem:function(k){
        if(typeof k=='string'){k=[k];}
        k.forEach(function(i){
            localStorage.removeItem(i);
        });
    }},{
        get:function(o,k){
            if(o[k]){return o[k];}
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
                        }else{rej('');}
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
    ,i18n:{
        _:{lang:null,map:null},
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
                    c.div.value=c.lang;
                }
            },100);
        }),
        set:function(language){
            O.Disk._lang=language;
            document.body.Class('ar',this.value!="ar");
            let e=this,c=e._,set=function(res){
                c.lang=language;
                O.Disk['_l'+c.lang+(this[1]||'')]=res;
                res=res.split('\n');
                if(e._.map){res=res.map(e._.map);}
                res.forEach(function(i,j){
                    c.phr[j+this]=i;
                },this[0]||1);
                if(this[2]=='net'){
                    var t=O.Disk_lTime||Array.from({length:c.ranges.length}).map(function(){return 0});
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
                    if(res=O.Disk['_l'+language+(j||'')]){
                        set.call([i,j],res);
                    }else{
                        O.req(this.vars({lang:language,part:j})).then(set.bind([i,j,'net']));
                    }
                    
                },c.path);
            }else{
                c.lang=language;
            }
        },
        init:function(config){
            if(config.ranges){config.r=0;}
            O.combine(this._,config);
            var last,t,t2;
            if(last=O.Disk._lTime&&(t='otag[i18n]'.get()).length){
                t=t[0].attr('i18n'),t2=O.Time.now;
                t=t.indexOf(',')==-1?Number(t):t.split(',').map(Number);
                var rem=[];
                (config.ranges||[1]).forEach(function(i,j){
                    if(t2<(typeof t=='number'?t:t[j])){
                        rem=rem.concat(Object.keys(config.langs).map(function(l){return '_l'+l+(j||'')}));
                    }
                });
                console.log(rem);
                O.Disk.rem(rem);
            }
            var lang=(O.Disk._lang||navigator.language.substr(0,2).toLowerCase());
            this.set(Object.keys(this._.langs).indexOf(lang)==-1?'en':lang);
            this._.div.prop({onchange:function(){
                O.i18n.set(this.value);
            }})
            .has(
                Object.keys(this._.langs).map(function(i,j){
                    return'option'.prop({value:i,selected:i==this[0]}).set(this[1][i]);
                },[this.get(),this._.langs]));
        }
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

        //tanıma duyarlı özellik tanımlar O.resp incele!
        resp:function(prop,f){
            return O.resp.call(this,prop,f);
        },
        /*
            String.prototype.extend incele
        */
        extend:function(component,args){
            if(O.UI[component]){
                return O.UI[component].apply(this,args||[]);
            }else{
                console.warn(component,'is not defined');
                return this;
            }
        },
        /*
            after kadar bekle-> .destroy sınıfı ekle-> dur kadar bekle-> belgeden kaldır.
            .destroy için bir CSS tanımlayınız, transition-duration değeri dur girdisi ile aynı olsun.
            .destroy{
                transition: .2s linear; // Geçiş 200ms
            }
            Öge.destroy(0,200)          // hemen yoketmeye başla 200ms sonra kaldır

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
        interval:function(f,t,args){
            if(this._interval){
                clearInterval(this._interval);
            }
            if(f=='passive'){return this;}
            if(typeof f =='function'){
                this.__interval=[function(i,a){f.apply(i,a||[]);},t,this,args];
                this.__iParams=[f,args||[],t];
            }
            this._interval=setInterval.apply(window,this.__interval);;
            this.__iParams[0].apply(this,this.__iParams[1]);
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

            this.className=c.reduce(function(a,b){
                a=a.replace(new RegExp("(\\b"+b+")+"),"");
                return (r?a:(a+" "+b)).replace(/\s{2}/g," ").trim();
            },this.className);
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
        /*
            a='a'.init(),b='b'.init();
            Öge='Öge'.append([a,b]);    // a,b ekle
            <div class="Öge"><a></a><b></b></div>

            Öge='Öge'.append([a,b],1);  // a,b ekle, ama tersten
            <div class="Öge"><b></b><a></a></div>       
    

            Öge'ye alt Öge ekler
        */
        append:function(e,rev){
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
                    if(!(i instanceof Element)){i=i.init();}
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
                for(i in e){
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
                s.prop('phr',phr);
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
                    console.log(1);
                    this.Lang(phrase,t);
                }else if(t instanceof Object){
                    if(!this.main){this.main=this.innerHTML;}
                    this.innerHTML=this.main.vars(this.data=t);
                }else{
                    this.innerHTML=t;
                }
            }else if(t){
                if(isFinite(t)){
                    this.Lang(t,phr==1?null:phr);
                }else{
                    this.main=t;
                    this.innerHTML=this.main.vars(this.data=phr);
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
            if(d[4].length||d[5].length){throw new Error('Module and argument selector is not available');}
            var th=O.toArray(document.querySelectorAll(this+''));
            
            if(d[3].length){
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
            

            if(d[4].length){
                let ui=d[4][0];
                if(!O.UI[ui]){console.log(ui,'is not defined')};
                d[0]=O.UI[ui].apply(ui,d[5].length?d[5].concat(O.toArray(arguments)):arguments);
            }else{
                d[0]=document.createElement(d[0]);
            }
            if(isFinite(s)&&s!=''&&O.i18n){
                d[0].set(s,1).Class('label');
            }
            if(d[1].length){
                d[0].Class(d[1]);
            }
            if(d[2] instanceof Object){
                d[0].attr(d[2]);
            }
            if(d[3].length){
                d[0].id=d[3][0];
            }
            //if(!d[0].View){d[0].View={};}
            return d[0];
        },
        /* 
            '#ResimKutusu'.extend('Bediz')

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
    }
}
};
O.F={
    //. A/B
    // [1,2,3,4].filter(O.Filter.arrHas([3,4,5])); =>1,2
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
        let j;
        if(this instanceof Object){j=("."+String(this)).init()}
        else{j=this.init()}
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
})
