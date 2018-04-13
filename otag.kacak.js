/*    _             _
  o  | |        o  | |                o
 _   |/   __,  _   |/   __  _  __    _    __
  |  |   /  | / |  |   |_/ / |/  |  / |  /  \
  |_/|__/\_/|/  |_/|__/|__/  |   |_/  |_/\__/
           /|
*          \|    2016-2018 ilgilenio® 
*                Otag Framework 1.1 stable
*                Licensed under MIT
* 
*   ÖNEMLİ HATIRLATMA:
*   Otağ'ın bu sürümü kararlı değildir ve değişiklikler oluşabilir.
*/
O=O.combine(O,{
    Data:function(){
        O._R=[];

        // alıcılar için Öge yöntemi tanımla
        O.define('method',{
            subs:function(instant){
                O._R.push(this);
                return this;
            }
        });

        /*
         *  O.Data.cast('stats:likes:today',[0,2,9,1,3]);
         *  O.Data.cast('stats:likes:today:2',9);
         *  O.Data.req('stats:likes','today');
         *  O.Data.req('stats:likes',['today','yesterday']);
         */



        return{
            get:function(root,aspect){
                let d=O.Disk['O:'+root][aspect];
                return d?O.resolve(d):this.fetch(root,aspect);
            },
            set:function(data){
                O.Disk['O:'+root]//data
                //this.cast();
            },
            set:function(root,data){
                O.Disk['O:'+root]//data
                //this.cast();
            },
            set:function(topic,data){
                O.Disk['O:'+topic.shift()]=[topic]//data
                this.cast(topic,data);
            },
            set:function(root,aspect,data){
                O.Disk['O:'+root][aspect]//data
                //this.cast();
            },
            rem:function(root){
                delete O.Disk['O:'+root]
                //this.cast(,-1);
            },
            //default fetcher, default data endpoint
            fetch:function(root,aspect){
                let f={o:root};
                if(aspect){o.a=aspect;}
                O.req('data',f).then(function(data){
                    this.set(root,aspect,data);
                })
                //this.cast(,-1);
            },
            cast:function(topic,data,opts){
                opts=opts||{},topic=String(topic).split(':');

                let _activator=Number(topic.shift());
                topic=topic.join(':');
                O._R.filter(O.F.eq(opts.activator||'oid',_activator)
                .forEach(topic.length?function(i){
                        if(i=i.V(topic)){
                            i.set(data);
                            if(opts.after){opts.after.call(i);}
                        }
                    }:function(i){
                    i.val=data;
                    if(opts.after){opts.after.call(i);}
                })
            }
        }
        /* Fikir verebilmek için bu yorum olarak yer almalı.
         * listen:function(){
         *      this.Socket.on('update',function(data){
         *          this.set(data);
         *      });
         * }
         */
        //req:function(){}
    }
    //e nesnesine tanıma duyarlı özellik tanımlar
    
    ,resolve:function(a){return (function(){return a;}).prom()();}
    //createUniqueKey with l length
    ,randKey:function(l){
        var ret='';
        while((l--)>0){
            ret+=String.fromCharCode((Math.round(Math.random()*1000)%25)+65);
        }
        return ret;
    }
});

O.proto={
    Element:{
        //form nesnesini özümler
        absorb:function(){
            var V={};
            O.toArray(this.children).forEach(function(e){
                let a=e.attr('name');
                if(a){
                    V[a]=e;
                }
            })
            this.View=O.combine(this.View||{},V);
            return this;
        },

        src:function(src){

            this.loaded=0;
            this.style.backgroundImage='';
            
            if(s==null){return this;}
            let s=this;
            (new Image()).prop({
                onload:function(){
                    s.Class('default',1).prop({
                        size:[this.height,this.width]
                        ,ratio:this.height/this.width
                        ,loaded:1
                    }).style.backgroundImage="url("+this.src+")";
                    if(s.onchange){
                        s.onchange();
                    }
                },
                onerror:function(){
                    var e=this.src;
                    this.src="";
                    this.src=e;
                    this.onerror=function(){
                        s.Class('default')
                        if(s.onerr){s.onerr.call(s);}
                    }
                }
                ,src:src
            });
            return this;
        },
        
        html:function(e){
            this.innerHTML="";
            return e?this.has.apply(this,arguments):this;
        },

        hasSize:function(){
            let i=this;
            return new Promise(function(res,rej){
                var j=setInterval(function(){
                    if(i.offsetWidth+i.offsetHeight>0){
                        res({w:i.offsetWidth,h:i.offsetHeight});
                        clearInterval(j);
                    }
                },100);
            });
        }
    },

    String:{
        object:function(init){
            let o={};
            this.split(',').forEach(function(i,j){
                o[i]=init(i,j);
            });
            return o;
        }
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

    grandparent:{get:function(){
        return this.parent.parent;
    }}
})