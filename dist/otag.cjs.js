"use strict";let Time=new Proxy({interval(...e){let t;return{start(){return this.stop(),t=setInterval.apply(null,e),this},stop(){return clearInterval(t),this}}},rules:{yesterday:864e5,today:0,now:0,tomorrow:-864e5}},{get(e,t){if("interval"==t)return e[t];let s=new Date(+new Date-e.rules[t]);return"now"!=t&&["Hours","Minutes","Seconds"].map(e=>s["set"+e](0)),Math.floor(s.getTime()/1e3)}}),Chain=function(e){let t=this||null;return function(...s){return t=this||t,new Promise((i,r)=>{let n,a=e.shift().prom().apply(t,s);for(;n=e.shift();)a=a.then(n).catch(r);a.then(i).catch(r)})}},now=()=>Math.floor(+new Date/1e3),Disk=new Proxy({expire:new Proxy({},{set:(e,t,s)=>(t=Disk.ƒscope?Disk.ƒscope+"_"+t:t,localStorage.setItem(t+":expire",now()+Number(s)),!0)}),rem:e=>{"string"==typeof e&&(e=[e]),"string"==typeof Disk.ƒscope&&(e=e.map(e=>Disk.ƒscope+"_"+e)),e.forEach(e=>{localStorage.removeItem(e)})}},{get:(e,t)=>{if(e[t])return e[t];let s;if(t=e.ƒscope?e.ƒscope+"_"+t:t,(s=localStorage.getItem(t+":expire"))&&Number(s)<now())return localStorage.removeItem(t),null;t=localStorage.getItem(t);try{return JSON.parse(t)}catch(e){return t}},set:(e,t,s)=>"ƒscope"==t?(e.ƒscope=s,!0):(t=e.ƒscope?e.ƒscope+"_"+t:t,localStorage.setItem(t,JSON.stringify(s)),!0),deleteProperty:(e,t)=>(t=e.ƒscope?e.ƒscope+"_"+t:t,localStorage.removeItem(t),!0),has:(e,t)=>(t=e.ƒscope?e.ƒscope+"_"+t:t,!!localStorage[t])});class Sanal$$1{constructor(e={_el:""}){Object.assign(this,e),e.ƒ&&Object.defineProperties(this,Object.keys(e.ƒ).reduce((t,s)=>(console.log(s),t[s]={get:e.ƒ[s]},t),{})),e.resp&&Object.defineProperties(this,Object.keys(e.resp).reduce((t,s)=>(t[s]={get:()=>this["_"+s],set(t){e.resp[s](t),this["_"+s]=t}},t),{})),this.shadow&&O$1.ready.then(()=>this.el),this.has(this.View)}V(e=""){return e.split(":").reduce((e,t)=>e&&e.View?""==t?e.View:e.View[t]:null,this)}p(e){let t=this;for(;e--;)t=t.parent;return t}do(e,t){return this.click=(()=>this.parent[e]()),this}has(e){return e&&(Object.keys(e).forEach(t=>{"string"==typeof e[t]&&("₺"==e[t][0]?e[t]=e[t].el:e[t]=new Sanal$$1({_el:e[t],parent:this})),e[t]instanceof Sanal$$1?e[t].parent=this:(e[t].parent=this,e[t]=new Sanal$$1(e[t]))}),this.View=e),this}append(e){return this.content=e,this}set content(e){this.$content=e,this._el&&"string"!=typeof this._el&&(this._el.innerHTML="",this._el.append(e.map(e=>e.el)))}get content(){return this.$content}set to(e){this.el.to=e}get valid(){if(this.validate){if("function"==typeof this.validate)return this.validate(this.value);{let e;return!Object.keys(this.validate).some(t=>(e=this.validate[t])&&!("function"==typeof e?e(this.View[t].value):e.test(this.View[t].value)))}}return!0}set value(e){if(e instanceof Promise)e.then(e=>{this.value=e});else{if(this.bind){let t=[];this.bind.before&&t.push(this.bind.before),t=t.concat(Object.keys(e).map(t=>{let s=this.bind.model.el;return s.source?s.oid=e[t]:s.value={key:t,value:e[t],_model:this.bind.model},s})),this.bind.after&&t.push(this.bind.after),this.content=t}else if(this.View){e._model&&(e=e.value);let t=Object.keys(e);t.forEach(t=>{this.View[t]&&("string"==typeof this.View[t]?this.View[t]=this.View[t].split(":").shift()+":"+e[t]:this.View[t].value=e[t])}),Object.keys(this.View).filter(e=>-1==t.indexOf(e)).forEach(t=>{t in e&&(this.View[t].value=e[t])})}else this.el.set&&this.el.set(e);this.set&&this.set(e),this.change&&this.change()}}get value(){this.View&&Object.keys(this.View).filter(e=>"_"!=e[0]).forEach(e=>{this.View[e].value})}get el(){let e=()=>{this._el.sanal=this,this.layout=this.template||Object.keys(this.View||{}).join("\n")+"\ncontent₺","string"==typeof this.bind&&(this.bind={model:this.bind});let e,t="NULLOID";this.source&&((e=this.source.on||"oid")in this&&(t=this[e]),Object.defineProperty(this,e,{get:()=>this["_"+e],set:t=>{this["_"+e]=t,this.value=this.source[t]}})),this.fetch&&(this.fetcher=this.fetch),["click","select","focus","load","keyup","keydown","keypress","change"].filter(e=>this[e]).forEach(e=>this._el["on"+e]="string"==typeof this[e]?t=>this[this[e]](t):t=>this[e](t)),this.enter&&this._el.addEventListener("keyup",(e=>13==e.keyCode?this[this.enter](e.target.value):null).prevent.stop),"NULLOID"!=t&&(this[e]=t)};return this._el&&"string"==typeof this._el&&(this._el=this._el.el,e()),this._el}set fetcher(e){clearInterval(this._fetchInterval);let t,s=()=>{O$1.req(e.from).then(t=>{e.shape&&(t=e.shape(t)),this.value=t,e.save&&(Disk[e.save]=t,e.expire&&(Disk.expire[e.save]=e.expire))})};e.save&&(t=Disk[e.save])?this.value=t:s(),e.refresh&&(this._fetchInterval=setInterval(s,1e3*e.refresh))}set layout(e){this.el.innerHTML="";let t,s,i,r,n=this.el,a=n,o=this.View;e=e.split("\n").forEach(e=>{if(r=e.trim(),t=r.length){if(i=(e.length-t)/2,o&&this.V(r))r=this.V(r).el;else if(":"==r[0])n instanceof Text&&s==i&&a.appendChild(document.createElement("br")),r=document.createTextNode(r.substring(1).trimLeft());else{r=r.el;let e=["click","select","focus","load","keyup","keydown","keypress","change"];[...r.attributes].forEach(t=>{console.log(t),e.indexOf(t.name)>-1?r["on"+t.name]=(e=>this[t.value].call(this,e)).stop.prevent:"enter"==t.name&&r.addEventListener("keyup",(e=>{console.log(e,e.keyCode),13==e.keyCode&&this[t.value](e.target.value)}).prevent.stop)})}if(null!=s&&i!=s){a=n;for(let e=i-1;e<s;e++)a=a.p}r instanceof Sanal$$1&&(r=r.el),a.appendChild(r),n=r,r.p=a,s=i}})}}var none={_el:"Bulunamadı",name:"Bulunamadı",template:"\n    center\n      h1:Bet Bulunamadı\n      p:Aradığınız bet bulunamadı"};class Page{constructor(e={}){(e=Object.assign({routes:{},none:none,handler:"body"},e)).routes.none=e.none,this.handler=e.handler,this.title=e.title;let t=this.routes=e.routes;Object.keys(t).filter(e=>"string"!=typeof t[e]).map(e=>(t[e]instanceof Sanal$$1||(t[e]=new Sanal$$1(t[e])),t[e].name||(t[e].name=e),t[e]._name=t[e].name,Object.defineProperty(t[e],"name",{get:()=>t[e]._name,set:s=>{this.setTitle(s),this.Nav.value={[e]:s},t[e]._name=s}}),t[e])),this.route(),window.onpopstate=this.route.bind(this)}setTitle(e){this._titleInfo=e=e||this._titleInfo,document.title=this.title}get title(){return(this._title||"title₺").vars({title:this._titleInfo})}set title(e){this._title=e,this.setTitle(e)}route(e){let t=0;e||(e=decodeURI(location.hash)),e instanceof Object&&!(e instanceof Array)&&(t=e.type&&"pushstate"==e.type,e=e.state||decodeURI(location.hash));var s=e.split("/");if("#"==s[0]&&s.shift(),""==s[0]&&this.routes.index)return this.route("index");let i,r=s.shift();if((i=this.routes[r])||(r="none",i=this.routes.none),"string"==typeof i)return this.route(i);if("function"==typeof i&&i.apply(null,s),i instanceof Sanal$$1){let e=this.page!=r;this.change&&this.change(r,s,e,!!i.once),this.page=r,this.handler&&("function"==typeof this.handler?this.handler(i):"string"==typeof this.handler?i.to=this.handler:this.handler.handle?this.handler.handle(i,e):i.to=this.handler),i.once?(i.once.apply(i,s),delete i.once):i.wake&&i.wake.apply(i,s)}t||window.history[(t?"push":"replace")+"State"](e,null,-1==e.indexOf("#")?"#/"+e:e)}Navigation(e={}){return(e=Object.assign({hide:[]},e)).hide.push("none"),this.Nav="Nav".kur({View:Object.keys(this.routes).filter(t=>"string"!=typeof this.routes[t]&&-1==e.hide.indexOf(t)).reduce((e,t)=>(e[t]='a[href="/#/'+t+'"][title="'+this.routes[t].name+'"]:'+this.routes[t].name,e),{})})}set page(e){this._page!=e&&(this.now=this.routes[e],this._page=e)}get page(){return this._page}set now(e){this.now&&this.now.idle&&this.now.idle();let{name:t}=e;this.setTitle(t),this._now=e}get now(){return this._now}set to(e){this.handler=e}}var Tor={Sock:Sock,req:req};function Sock(e){(e=Object.assign({url:null,q:{},interval:3e3},"string"==typeof e?{url:e}:e||{})).q=Object.assign(e.q,e.socketio?{transport:"polling",EIO:3}:{_osid:O._uid(16)}),e.url=e.url||window.location.origin,e.socketio&&(e.url+="socket.io/");let t=/((ws|http)s?):\/\//g.exec(e.url);t?"http"==(t=t[1]).substr(0,4)&&(e.url=(t.length>4?"wss://":"ws://")+e.url.split("://")[1]):e.url="wss://"+e.url,e.url+="?"+_queryString(e.q);let s,i,r,n={};return r={on(e,t){return e instanceof Object?Object.keys(e).forEach(t=>{n[t]=e[t]}):n[e]=t,this},connect(){return this.connected||((s=Object.assign(new WebSocket(e.url+"&_tstamp="+O.Time.now),{onopen(e){i.stop(),this.connected=1,n.open&&n.open(e.data)},lib:this,onmessage(e){let t=(e=e.data).indexOf(","),s=e.substr(0,t);n[s]&&n[s](JSON.parse(e.substring(t+1)),this)},onclose(e){"error"==e.type&&n.error&&n.error(e),console.log("error",e),this.lib.connected=0,i.start()}})).onerror=s.onclose),this},emit(e,t){s.send(e+","+JSON.stringify(t))}},i=O.interval(r.connect,e.interval).start(),r.connect()}function req(e="",t,s){var i=new XMLHttpRequest;return e=e.indexOf("//")>-1?e:("string"!=typeof this?"./ep₺":this).vars({ep:e}),i.open(s?s.toUpperCase():t?"POST":"GET",e,!0),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),new Promise(function(e,s){i.onreadystatechange=function(){if(4==this.readyState)if(200==this.status)if(""!=this.response){var t;try{t=JSON.parse(this.response)}catch(e){t=this.response}e(t)}else s({error:"empty response"});else s({error:{code:this.status}})},i.send(t?_queryString(t):"")})}let _queryString=e=>{let t=arguments[1];var s=[];for(var i in e)if(e.hasOwnProperty(i)){var r=t?t+"["+i+"]":i,n=e[i];s.push("object"==typeof n?_queryString(n,r):encodeURIComponent(r)+"="+encodeURIComponent(n))}return s.join("&")},O$1={require(js,path=""){return Tor.req(path+js+".js").then(code=>{let module={};return eval(code),module.exports})},define(e,t){this[e]||(this[e]={}),Object.keys(t).forEach(s=>this[e][s]=t[s])},calc:(e,t)=>(Object.defineProperties(e,Object.keys(t).reduce((s,i)=>(s[i]={get:t[i].bind(e),set:e=>console.error(i,"için değer ataması yapılamaz.")},s),{})),e),UI:{M:(...e)=>O$1.Model[e.shift()].apply("",e)},req:Tor.req,Model:{},ready:new Promise(e=>{document.addEventListener("DOMContentLoaded",()=>{let{body:t,head:s}=document;e({body:t,head:s})})})},_selector=e=>{let t=[],s=(e.match(/\[([0-9A-Za-z.-_şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9,'.-_şŞüÜöÖçÇİığĞ#\(\):@ ]+)"\]/g)||[]).reduce((t,s)=>(e=e.replace(s,""),t[(s=s.match(/([0-9A-Za-z.şŞüÜöÖçÇİığĞ]+)="([0-9A-Za-z0-9,.-_şŞüÜöÖçÇİığĞ#\(\):@ ]+)/))[1]]=s[2],t),{});e.indexOf(":")>-1&&(t=e.split(":"),e=t.shift());var i={class:/\.([0-9A-Za-z_\-şŞüÜöÖçÇİığĞ]+)/g,id:/#([0-9A-Za-z\-_şŞüÜöÖçÇİığĞ]+)/,ui:/[$|₺|₸|₼]([0-9A-Za-zşŞüÜöÖçÇİığĞ]+)/,tag:/^[a-zşüöçığ][a-zşüöçığ0-9]*?$/g};return(i=Object.keys(i).reduce((t,s)=>{for(var r,n=[],a=-1,o=i[s];(r=o.exec(e))&&o.lastIndex!=a;){if(n.push(r[0]),a=o.lastIndex,!(t[s]instanceof Array)){t[s]=r[1]||r[0],e=e.replace(r[0],"");break}t[s].push(r[1])}return n.forEach(t=>{e=e.replace(t,"")}),t},{class:[],id:"",ui:null,tag:null})).args=t,i.attr=s,e.length&&(i.class=i.class.concat(e.split(" "))),i},proto={Element:{destroy(e=0,t=300){return new Promise(s=>{setTimeout(()=>{setTimeout(()=>{this.remove(),s()},t),this.Class("destroy")},e)})},disp(e){return e||this.hasOwnProperty("dispState")||(this.dispState=this.style.display),this.style.display=e?this.dispState:"none",this},class(e){if("function"==typeof e)this.class(e());else{let t={add:[],rem:[]};Object.keys(e).forEach(s=>{t[("function"==typeof e[s]?e[s]():e[s])?"add":"rem"].push(s)}),this.Class(t.rem,0).Class(t.add)}return this},Class(e,t=!0){return e instanceof Array||(e=[e]),e[0]&&""!=e[0]&&(this.className=e.reduce((e,s)=>(e=e.replace(new RegExp("(\\b"+s+")+"),""),(t?e+" "+s:e).replace(/\s{2}/g," ").trim()),this.className),""==this.className.trim()&&this.removeAttribute("class")),this},do(e,t="click",s){return arguments[3]&&(s=[...arguments].splice(2)),this["on"+t]=(()=>{this.parent[e].apply(this.parent,s||[])}),this},append(e,t){return e&&(e instanceof Array||(e=[e]),t&&(e=e.reverse()),e.forEach(e=>this.appendChild(e.el))),this},set(...e){return"string"==typeof e[0]&&(this.innerHTML=e.map(e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")).join("<br>")),this},pitch(e){return e.html&&(this.innerHTML=Disk[e.html]),this.innerHTML="",e?this.append.apply(this,arguments):this}},String:{kur(e={}){return new Sanal$$1(Object.assign(e,{_el:this}))},val(e){let t=this.split(",").map(t=>e.val[t]);return 1==t.length?t[0]:t},vars(e){return e="object"==typeof e?e:arguments,Object.keys(e).reduce((t,s)=>t.replace(new RegExp("("+s+"[₺|$|₸|₼])+"),e[s]),this)},replaceAll(e,t){let s=this;for(var i in e)for(;s.indexOf(e[i])>-1;)s=s.replace(e[i],t[i]);return s},of(e){return"*"==this?e:this.split(",").reduce((t,s)=>(t[s]=e[s]||null,t),{})},from(e){let t=("*"==this?Object.keys(e):this.split(",")).map(t=>e[t]);return-1==this.indexOf(",")&&"*"!=this?t[0]:t},obj(e,t){return this.split(",").reduce(t instanceof Array?(s,i,r)=>(s[i]=e[r]||t[r],s):(s,i,r)=>(s[i]=e[r]||t,s),{})}},Function:{interval(e){let t,s=this;return{start(...i){return this.stop(),t=setInterval.apply(null,[s,e].concat(i)),this},stop(){return clearInterval(t),this}}},prom(e){let t=this.bind(e);return(...e)=>new Promise((s,i)=>{try{var r=t.apply(null,e);r.then?r.then(s).catch(i):s(r)}catch(e){i(e)}})},debounce(e){let t,s=this;return function(...i){return clearTimeout(t),t=setTimeout(()=>{s.apply(s,i)},e),this}}},SVGElement:{set(e,t,s){return this.disp(0),O$1.req(e).then(e=>{let i=(new DOMParser).parseFromString(e,"text/xml").children[0];[...i.attributes].forEach(e=>this.setAttribute(e.name,e.value)),this.style.height=t,this.style.width=s,this.innerHTML=i.innerHTML,this.disp(1)}),this}},Image:{set(e,t){return t?(O$1.req(e).then(e=>this.innerHTML=e),this):(this.loader=new Promise((t,s)=>{Object.assign(this,{onload(){this.Class("loading",0),t()},onerror(){this.Class("loading",0).Class("error"),s()},src:e})}),this.Class("loading"))}},HTMLInputElement:{set(e,t="text"){this.type=t,this.placeholder=e}}},props={String:{get:{get(){var e=[...document.querySelectorAll(this)];return this.indexOf("#")>-1&&(e=e[0]),e}},to:{set(e){this.el.to=e}},el:{get(){let e,t=_selector(this+"");return t.ui?(O$1.UI[t.ui]||console.error(t.ui,"is not defined"),e=O$1.UI[t.ui].apply(t.ui,t.args)):(e="svg"==t.tag?document.createElementNS("http://www.w3.org/2000/svg","svg"):document.createElement(t.tag||"div"),t.args.length&&e.set.apply(e,t.args)),Object.keys(t.attr).map(s=>e.setAttribute(s,t.attr[s])),t.id.length&&(e.id=t.id),t.class.length&&(e.className=t.class.join(" ")),e},set(e){let t=this.el;return["click","load"].forEach(s=>{delete e[s],e[s]&&(t["on"+s]=e[s])}),["prop","has","layout","resp","set","attr","valid"].forEach(s=>{e.hasOwnProperty()&&(t[s](e[s]),delete e[s])}),e.to&&("string"==typeof e.to?e.to.append(t):t.to=e.to,delete e.to),Object.assign(t,e),t}}},Element:{sanal:{get(){return this._sanal},set(e){let t=this.getAttribute("enter");t&&this.addEventListener("keyup",(s=>{13==s.keyCode&&e.parent[t](this.value)}).prevent.stop),this.innerHTML.indexOf("₺")>-1&&(this.innerHTML=this.innerHTML.vars(e)),this._sanal=e}},el:{get(){return this}},str:{get(){let e=["id","class"],t="DIV"!=this.tagName?this.tagName.toLowerCase():"";return t+=""!=this.id?"#"+this.id:"",t+=[...this.classList].map(e=>"."+e).join(""),[...this.attributes].forEach(s=>{e.indexOf(s.name)<0&&(s.value=s.value.replace("https:","").replace("http:",""),t+="["+s.name+'="'+s.value+'"]')}),t}},to:{set(e){"string"==typeof e?O$1.ready.then(()=>{let t=e.get;if(!(t=t instanceof Array?t[0]:t))return console.error('"seçici₺" ile belgede öge bulunamadı'.vars({"seçici":e})),0;t.pitch(this)}):(e instanceof Sanal$$1&&(e=e.el),e.pitch(this))}}},Function:{prevent:{get(){return e=>{e.preventDefault(),this(e)}}},stop:{get(){return e=>{e.stopPropagation(),this(e)}}},bounced:{get(){return this.debounce(100)}}},Image:{value:{get(){return this.src},set(e){return this.loader=new Promise((t,s)=>{this.prop({onload(){this.Class("loading",0),t()},onerror(){this.Class("loading",0).Class("error"),s()},src:e})}),this.Class("loading"),e}}}};(e=>{Object.keys(proto).filter(t=>e[t].prototype||e[t]).forEach(t=>Object.assign(e[t].prototype||e[t],proto[t])),Object.keys(props).filter(t=>e[t].prototype||e[t]).forEach(t=>Object.defineProperties(e[t].prototype||e[t],props[t])),Object.keys(proto.Element).forEach(t=>{e.Number.prototype[t]=e.String.prototype[t]=function(...e){let s=this.kur();return s[t].apply(s,e)}})})(window||global);var geleneksel={require(js,path=""){return Tor.req(path+js+".js").then(code=>{let module={};return eval(code),module.exports})},define(e,t){this[e]||(this[e]={}),Object.keys(t).forEach(s=>this[e][s]=t[s])},calc:(e,t)=>(Object.defineProperties(e,Object.keys(t).reduce((s,i)=>(s[i]={get:t[i].bind(e),set:e=>console.error(i,"için değer ataması yapılamaz.")},s),{})),e),UI:{M:(...e)=>O.Model[e.shift()].apply("",e)},req:Tor.req,Model:{},ready:new Promise(e=>{document.addEventListener("DOMContentLoaded",()=>{let{body:t,head:s}=document;e({body:t,head:s})})}),Time:Time,Chain:Chain,Page:Page,Disk:Disk};module.exports=geleneksel;