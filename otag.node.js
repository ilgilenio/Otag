/*    _             _
  o  | |        o  | |                o
 _   |/   __,  _   |/   __  _  __    _    __
  |  |   /  | / |  |   |_/ / |/  |  / |  /  \
  |_/|__/\_/|/  |_/|__/|__/  |   |_/  |_/\__/
          /|
*         \|    2018 ilgilenio® 
*               Otag Arka Uç Çatısı 0.0.0
*               https://github.com/ilgilenio/Otag/wiki
*               MIT ile korunmaktadır
*/
"use strict"
let fs=require('fs');
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
            var fx=prop[p];
            // Bu özellikte daha önceden tanımlanmış bir duyar var mı
            if(e.__lookupGetter__(p)){
                let fOld=e.__lookupGetter__(p)(1);
                if(typeof fOld=='function'){fOld=[fOld];}
                //Eski duyarla yeni duyarı birleştir.
                fx=fOld.concat(fx);
            }else{
                if(e[p]!=undefined){e['_'+p]=e[p];}
            }

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
            return s;
        },{}));
        return e;
    },
    /*
        O.resp.call({},{prop:f()})

        prop    : Duyarlı özellik
        f       : Atanırken çağrılacak işlev

        Bir nesneye tanıma duyarlı özellik tanımlar.
    */
    respOnce:function(prop,f){
        if(typeof prop=='string'){
            prop={[prop]:f};
        }
        let e=this||{};
        Object.defineProperties(e,Object.keys(prop).reduce(function(s,p){
            var fx=prop[p];
            // Bu özellikte daha önceden tanımlanmış bir duyar var mı
            if(e[p]!=undefined){e['_'+p]=e[p];}
            s[p]={
                get:function(){
                    return this['_'+p];
                },
                set:function(val){
                    if(val!=this[p]){
                        fx.call(this,val);
                        this['_'+p]=val;
                    }
                }
            };
            return s;
        },{}));
        return e;
    },
    /*
        O.stor.call({},{prop:storekey})
        O.stor.call({},prop,storekey)

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
            // Bu özellikte daha önceden tanımlanmış bir duyar var mı
            if((v=O.Disk[store])!=null){
                e[p]=v;
            }/*else if(e[p]){
                O.Disk[store]=e[p];
            }*/
            return O.resp.call(e,p,function(val){
                O.Disk[store]=val;
            });
        },this||{});
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
    /*
        O.Time.now       Şimdi (UNIX zamanı) sn cinsinden verir.
        O.Time.yesterday Dünün ilk sn verir.

    */
    Time:new Proxy({
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
    ,Disk:new Proxy({available:true,rem:function(k){
        if(typeof k=='string'){k=[k];}
        k.forEach(function(i){
            localStorage.removeItem(i);
        });
    }},{
        get:function(o,k){
            if(o[k]){return o[k];}
            console.log(arguments);
           if (k == util.inspect.custom) return;
            k=fs.readFileSync(('.localStorage/s'),'utf8');
    
            try{
                return JSON.parse(k);
            }
            catch(Exception){
                return k;
            }
        }
        ,set:function(o,k,v){
            fs.writeFile('.localStorage/'+k, JSON.stringify(v),{flag:"w+"}, function(err) {
                if(err) {
                    return console.log(err);
                }
            }); 
            return true;
        }
        ,deleteProperty:function(o,k){
            console.log('Bu özellik Eklenecek');
            return 0;
        }
        ,has:function(o,k){
            console.log('Bu özellik Eklenecek');
            return 0;
        }
    }),
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
        _:{lang:null,map:null,rtl:[],ranges:[1],scope:''},
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
            O.ready.then(b=>b.Class('rtl',O.i18n._.rtl.indexOf(O.Disk._lang)==-1));
            let e=this,c=e._,set=function(res){
                c.lang=language;
                O.Disk['_l'+c.lang+(this[1]||'')+e._.scope]=res;
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
                    if(res=O.Disk['_l'+language+(j||'')+e._.scope]){
                        set.call([i,j],res);
                    }else{
                        O.req(this.vars({lang:language,part:j,scope:e._.scope})).then(set.bind([i,j,'net']));
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
                        rem=rem.concat(Object.keys(config.langs).map(function(l){return '_l'+l+(j||'')+(config.scope||'')}));
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
    String:{
        /* 
            'o,t,a,g'.from({g:2,o:'bc',a:5,t:5,y:2017}).join('') // 'bc552'

            Nesneden belirli özelliklerin değerlerini sırayla getirir. Dizi oluşturur
        */

        from:function(obj){
            let r=this.split(',').map(function(i){return obj[i]});
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


module.exports=function(){

Object.keys(O.proto).forEach(function(i){
    O.combine(this[i].prototype||window[i],O.proto[i]);
},this);
delete O.proto;
return O;

};