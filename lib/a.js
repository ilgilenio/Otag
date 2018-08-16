"use strict";
var global$1 = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};
function createCommonjsModule(e, t) {
    return e(t = {
        exports: {}
    }, t.exports),
    t.exports
}
var Nesne_min = createCommonjsModule(function(e) {
    let t = {
        toArray: function(e) {
            return Object.keys(e).map(t=>e[t])
        },
        combine: function() {
            let e = this.toArray(arguments);
            return e.reduce((e,t)=>(Object.keys(t).forEach(n=>{
                e[n] = t[n]
            }
            ),
            e), e.shift())
        },
        cumul: function() {
            let e = this.toArray(arguments);
            return e.reduce((e,t)=>(Object.keys(t).forEach(n=>{
                e.hasOwnProperty(n) || (e[n] = 0),
                e[n] += t[n]
            }
            ),
            e), e.shift())
        },
        match: function(e, t, n, i) {
            return n.reduce(i instanceof Object ? (e,n)=>(e[n] = t.hasOwnProperty(n) ? t[n] : i.hasOwnProperty(n) ? i[n] : null != i._def ? i._def : null,
            e) : (e,n)=>(e[n] = t.hasOwnProperty(n) ? t[n] : i,
            e), e)
        },
        map: function(e, t, n, i) {
            return Object.keys(n ? t : e).reduce((n,r)=>(n[t[r]] = e.hasOwnProperty(r) ? e[r] : i,
            n), {})
        }
    };
    e.exports = t
});
function DOM(e) {
    Object.keys(prototype).filter(t=>e[t].prototype || e[t]).forEach(t=>Object.assign(e[t].prototype || e[t], prototype[t])),
    Object.keys(prototype.Element).forEach(t=>{
        e.Number.prototype[t] = e.String.prototype[t] = function() {
            let e = this.init();
            return e[t].apply(e, arguments)
        }
    }
    ),
    e.Element && Object.defineProperties(e.Element.prototype, {
        val: {
            get() {
                if ("function" == typeof this.value)
                    return this.value();
                if (this.value || this.hasOwnProperty("value"))
                    return this.value;
                if (this.View) {
                    let e, t = {}, n = this;
                    return Object.keys(this.View).some(function(i) {
                        if ("_" != i[0] && !this.View[i].isSameNode(n)) {
                            if (this._validator && (e = this._validator[i]) && !("function" == typeof e ? e(this.View[i].val) : e.test(this.View[i].val)))
                                return this._invalid && this._invalid(),
                                !0;
                            t[i] = this.View[i].val
                        }
                        return !1
                    }, this) ? null : t
                }
                return this.data || null
            },
            set(e) {
                if (e instanceof Promise) {
                    let t = this;
                    e.then(function(e) {
                        t.val = e
                    })
                }
                this[this.View ? "setView" : "set"](e)
            }
        }
    })
}
let prototype = {
    Element: {
        V(e) {
            return (e || "").split(":").reduce((e,t)=>e ? "" == t ? e.View : e.View[t] ? e.View[t] : null : null, this)
        },
        p(e) {
            for (var t = this; e--; )
                t = t.parent;
            return t
        },
        resp(e, t) {
            return O.resp.call(this, e, t)
        },
        stor(e, t) {
            return O.stor.call(this, e, t)
        },
        extend(e, t) {
            return O.UI[e] ? O.UI[e].apply(this, t || []) : (console.warn("â‚º" + e, "is not defined"),
            this)
        },
        destroy(e, t) {
            let n = this;
            return new Promise(i=>{
                setTimeout(()=>{
                    setTimeout(()=>{
                        n.remove(),
                        i()
                    }
                    , t || 300),
                    n.Class("destroy")
                }
                , e || 0)
            }
            )
        },
        interval(e, t, n, i) {
            return this._interval ? "string" == typeof e ? this._interval[e]() : isFinite(e) && this._interval[Number(e) > 0 ? "start" : "stop"]() : ("string" == typeof e && (e = this[e]),
            this._interval = O.interval.apply(null, [e.bind(this), t].concat(n)),
            i && (this._interval.start(),
            e.apply(this, n))),
            this
        },
        disp(e) {
            return e || this.hasOwnProperty("dispState") || (this.dispState = this.style.display),
            this.style.display = e ? this.dispState : "none",
            this
        },
        prop(e, t, n) {
            var i;
            return null == t && !(e instanceof Object) || e instanceof Array ? e instanceof Array ? (i = {},
            e.forEach(e=>{
                i[e] = n ? this.getAttribute(e) : this[e]
            }
            , this)) : i = n ? this.getAttribute(e) : this[e] : (i = this,
            n ? (e instanceof Object || (e = {
                [e]: t
            }),
            Object.keys(e).forEach(t=>{
                i.setAttribute(t, e[t])
            }
            )) : e instanceof Object ? (Object.keys(e).forEach(function(t) {
                "function" == typeof e[t] && (e[t] = e[t].bind(i))
            }),
            Object.assign(this, e)) : this[e] = t),
            i
        },
        class(e) {
            if ("function" == typeof e)
                this.class(e());
            else {
                let t = {
                    add: [],
                    rem: []
                };
                Object.keys(e).forEach(n=>{
                    t[("function" == typeof e[n] ? e[n]() : e[n]) ? "add" : "rem"].push(n)
                }
                ),
                this.Class(t.rem, 1).Class(t.add)
            }
            return this
        },
        Class(e, t) {
            return e instanceof Array || (e = [e]),
            e[0] && "" != e[0] && (this.className = e.reduce((e,n)=>(e = e.replace(new RegExp("(\\b" + n + ")+"), ""),
            (t ? e : e + " " + n).replace(/\s{2}/g, " ").trim()), this.className)),
            this
        },
        layout(e, t) {
            let n = t || this;
            return this.innerHTML = "",
            this.append(e.map(e=>e instanceof Element ? e : e instanceof Array ? e[0].layout(e[1], n) : n.V(e) || e.init()))
        },
        do(e, t, n) {
            return arguments[3] && (n = Nesne_min.toArray(arguments).splice(2)),
            this.prop("on" + (t || "click"), ()=>{
                this.parent[e].apply(this.parent, n || [])
            }
            )
        },
        append(e, t) {
            return e && (e instanceof Array ? e[0]instanceof Array && (e = e.map(e=>"d".append(e))) : e = [e],
            t && (e = e.reverse()),
            e.forEach(e=>{
                e instanceof Node || (e = e.init()),
                this.appendChild(e)
            }
            )),
            this
        },
        has(e, t) {
            if (e) {
                if (this.View || (this.View = {}),
                e instanceof Array && !(e[0]instanceof Element)) {
                    var n = [];
                    for (var i in e)
                        n.push("d".has(e[i])),
                        e[i].parent = this,
                        Object.assign(this.View, e[i]);
                    e = n
                }
                ("object" != typeof e || e instanceof Element) && (e = [e]),
                e instanceof Object && (e = (e._ ? "function" == typeof e._ ? Object.keys(e).filter(t=>e[t]instanceof Element).sort(e._) : e._ : Object.keys(e)).map(t=>("function" == typeof e[t] && (e[t] = e[t]()),
                this.View[t] = e[t].prop({
                    parent: this
                }))))
            }
            return this.append(e, t)
        },
        html(e) {
            return this.innerHTML = "",
            e ? this.has.apply(this, arguments) : this
        },
        Lang(e, t) {
            e = e || this.attr("phrase") || this.prop("phrase");
            let n = this;
            n.attr("phrase", e),
            t && n.prop("phr" + ("function" == typeof t ? "Select" : ""), t),
            this.phr && this.phrSelect && (e = Number(e) + this.phrSelect(this.phr) / 10);
            let i = this.attr("t") || this.t;
            return O.i18n.get(e).then(function(e) {
                n.phr && (n.phr instanceof Object || (n.phr = [n.phr]),
                e = e.vars(n.phr)),
                n.ttl && (n.title = e),
                ["title", "placeholder"].indexOf(i) > -1 ? n.attr(i, e) : n.innerHTML = e
            }),
            n
        },
        setSafe(e, t) {
            let n = e=>("string" == typeof e && (e = e.replaceAll([/&/g, /</g, />/g, /"/g, /'/g], ["&amp;", "&lt;", "&gt;", "&quot;", "&#039;"])),
            e);
            return this.set(n(e), n(t))
        },
        set(e, t) {
            if (e && !t) {
                let t;
                (t = this.attr("phrase")) ? (e instanceof Object || (e = [e]),
                this.phr = e,
                this.Lang(t, e)) : e instanceof Object ? (this.main || (this.main = this.innerHTML),
                e._ ? (this.innerHTML = "",
                this.append(this.main.varsX(this.data = e))) : this.innerHTML = this.main.vars(this.data = e).replace(/\n/gm, "<br>")) : this.innerHTML = String(e).replace(/\n/gm, "<br>")
            } else
                e ? isFinite(e) ? this.Lang(e, 1 == t ? null : t) : (this.main = e,
                t._ ? (this.innerHTML = "",
                this.append(this.main.varsX(this.data = t))) : this.innerHTML = this.main.vars(this.data = t).replace(/\n/gm, "<br>")) : this.innerHTML = "";
            return this.Class("def", 1)
        },
        setView(e) {
            let t = this.View;
            return this.ondata && this.ondata(e),
            (e._ || Object.keys(e)).forEach(n=>{
                t.hasOwnProperty(n) && t[n].set(e[n])
            }
            ),
            this
        },
        attr(e, t) {
            return this.prop.apply(this, [e, t, "attr"])
        },
        link(e, t) {
            return this.href = t || e,
            this.addr = e,
            -1 != e.indexOf("//") || this.onclick || (this.onclick = function(e) {
                e.preventDefault(),
                "function" != O.Page && O.Page.route(this.addr, 1)
            }
            ),
            this
        },
        connect(e, t, n) {
            if (!e)
                throw Error(".connect requires a data source. https://otagjs.org/#/belge/.connect");
            t = t || "oid";
            let i = (e instanceof Element ? function(t) {
                this.val = e.val
            }
            : function(t) {
                let n = e instanceof Function ? e(t) : e[t];
                i = (e=>{
                    this.val = e
                }
                ),
                n instanceof Promise ? n.then(i) : i(n)
            }
            ).bind(this);
            if (n) {
                let e = null;
                n instanceof Object && n.range && (e = n.range),
                this.prop({
                    dataNav(n) {
                        if (this.source[n]) {
                            let e = this.source[n]
                              , i = e=>{
                                this[t] = e
                            }
                            ;
                            "function" == typeof e && (e = e())instanceof Promise ? e.then(i) : i(e)
                        } else {
                            let i = e || [0, this.source.length - 1]
                              , r = this[t];
                            (r = "prev" == n ? r - 1 : r + 1) < i[0] ? r = i[1] : r > i[1] && (r = i[0]),
                            this[t] = r
                        }
                        return this
                    },
                    next() {
                        return this.dataNav("next")
                    },
                    prev() {
                        return this.dataNav("prev")
                    }
                })
            }
            return this.prop("source", e).resp(t, i),
            e.hasOwnProperty("_conn") && e._conn(this, t),
            this
        },
        valid(e, t) {
            return this._validator = e,
            this._invalid = t,
            this
        }
    },
    String: {
        get(e) {
            let t = this + ""
              , n = O._selector(t);
            if (n.args.length || n.ui)
                throw new Error("Module and argument selector is not available");
            var i = Nesne_min.toArray(document.querySelectorAll(this + ""));
            return n.id && (e = 0),
            null != e && (i = i[e]),
            i
        },
        init() {
            let e = this + ""
              , t = O._selector(e);
            return t.ui ? (O.UI[t.ui] || console.log(t.ui, "is not defined"),
            t.el = O.UI[t.ui].apply(t.ui, t.args.concat(Nesne_min.toArray(arguments)))) : t.el = document.createElement(t.el || "div"),
            t.el.Class(t.class).attr(t.attr),
            t.id && (t.el.id = t.id),
            "INPUT" == t.el.tagName && t.el.addEventListener("keyup", function(e) {
                13 == e.keyCode && this.enter && this.enter(this.value)
            }),
            t.el.View || (t.el.View = {}),
            t.el
        },
        extends() {
            let e = (this + "").get();
            return e instanceof Array ? e.map(O.F.each("extend", Nesne_min.toArray(arguments))) : e.extend.apply(e, arguments)
        },
        from(e) {
            let t = ("*" == this ? Object.keys(e) : this.split(",")).map(t=>e[t]);
            return -1 == this.indexOf(",") && "*" != this ? t[0] : t
        },
        val(e) {
            let t = this.split(",").map(t=>e.val[t]);
            return 1 == t.length ? t[0] : t
        },
        of(e) {
            return "*" == this ? e : this.split(",").reduce((t,n)=>(t[n] = e[n] || null,
            t), {})
        },
        obj(e, t) {
            return this.split(",").reduce(t instanceof Array ? (n,i,r)=>(n[i] = e[r] || t[r],
            n) : (n,i,r)=>(n[i] = e[r] || t,
            n), {})
        },
        vars(e) {
            return e = "object" == typeof e ? e : arguments,
            Object.keys(e).reduce((t,n)=>t.replace(new RegExp("(" + n + "[â‚º|$|â‚¸|â‚¼])+"), e[n]), this)
        },
        varsX(e) {
            e = "object" == typeof e ? e : arguments;
            let t = Object.keys(e).reduce((t,n)=>t.replace(new RegExp("(" + n + "[â‚º|$|â‚¸|â‚¼])+"), e[n]instanceof Element ? "|" + n + "|" : e[n]), this).split("|");
            return t = t.map((t,n)=>n % 2 ? e[t] : document.createTextNode(t)),
            console.log(t),
            t
        },
        replaceAll(e, t) {
            var n = this;
            for (var i in e)
                for (; n.indexOf(e[i]) > -1; )
                    n = n.replace(e[i], t[i]);
            return n
        }
    },
    Function: {
        prevent() {
            return e=>{
                e.preventDefault(),
                this(e)
            }
        },
        stop() {
            return e=>{
                e.stopPropagation(),
                this(e)
            }
        },
        prom(e) {
            let t = this.bind(e);
            return ()=>{
                let e = arguments;
                return new Promise((n,i)=>{
                    try {
                        n(t.apply(null, e))
                    } catch (e) {
                        i(e)
                    }
                }
                )
            }
        },
        debounce(e) {
            let t, n = this;
            return function() {
                let i = arguments
                  , r = this;
                return clearTimeout(t),
                t = setTimeout(()=>{
                    n.apply(r, i)
                }
                , e),
                r
            }
        }
    },
    Image: {
        set(e) {
            return this.Class("loading").prop({
                onload() {
                    this.Class("loading", 1)
                },
                onerror() {
                    this.Class("loading", 1).Class("error")
                },
                src: e
            })
        },
        value() {
            return this.src
        }
    }
};
new Proxy({
    yesterday: 864e5,
    today: 0,
    now: 0,
    tomorrow: -864e5
},{
    get: function(e, t, n) {
        let i = new Date(+new Date - e[t]);
        return "now" != t && (i.setHours(0),
        i.setMinutes(0),
        i.setSeconds(0)),
        Math.floor(i.getTime() / 1e3)
    }
});
var notFound = "BulunamadÄ±".prop({
    name: "BulunamadÄ±"
}).layout([["center", ["h1".set("Bet BulunamadÄ±"), "p".set("AradÄ±ÄŸÄ±nÄ±z bet bulunamadÄ±")]]]);
function Page(e) {
    (e = Object.assign({
        routes: {},
        Nav: !0,
        hide: [],
        notFound: notFound,
        handler: e=>{
            document.body.html(e)
        }
    }, e || {})).hide.push("notFound"),
    e.routes.notFound = e.notFound,
    Element.prototype.router = function(e) {
        return this.resp("route", function(e) {
            this.route && delete O.Page.routes[this.route],
            O.Page.routes[e] = this
        }).prop("route", e)
    }
    ,
    O.Page = O.resp.call({
        to: new Proxy({},{
            get: (e,t)=>(function() {
                if (this) {
                    let e = Nesne_min.toArray(arguments);
                    return ()=>{
                        O.Page.routeSilent(t, e.concat(Nesne_min.toArray(arguments)))
                    }
                }
                O.Page.routeSilent(t, Nesne_min.toArray(arguments))
            }
            )
        }),
        routes: new Proxy({},{
            set: (t,n,i)=>(t[n] = i,
            e.Nav && i instanceof Element && e.hide.indexOf(n) < 0 && O.Page.Nav.append("a".link(n, "#/" + n).set(i.name)),
            !0),
            get: (e,t)=>e[t] ? e[t] : null
        }),
        routeSilent(t, n, i) {
            if ("" == t && this.routes.index)
                return this.routeSilent("index", n);
            let r;
            if ((r = this.routes[t]) || (r = this.notFound),
            "string" == typeof r)
                return this.routeSilent(r, n);
            if ("function" == typeof r && r.apply(null, n),
            r instanceof Element) {
                if (this.now = r,
                e.handler) {
                    let t = t=>{
                        e.handler.handle ? e.handler.handle(t) : e.handler.html(t)
                    }
                    ;
                    "function" == typeof e.handler ? e.handler(r) : "string" == typeof e.handler ? O.ready.then(()=>(e.handler = e.handler.get()) && t(r)) : t(r)
                }
                r.once ? (r.once.apply(r, n),
                delete r.once) : r.wake && r.wake.apply(r, n)
            }
            window.history[(i ? "push" : "replace") + "State"](t, null, "#/" + t)
        },
        route(t, n) {
            t instanceof Object && !(t instanceof Array) && (t = t.state || "");
            var i = t.split("/");
            if (t instanceof Array ? (i = t,
            t = t.join("/")) : "#" == (i = t.split("/"))[0] && i.shift(),
            "" == i[0] && this.routes.index)
                return this.route("index");
            let r;
            if ((r = this.routes[i.shift()]) || (r = this.notFound),
            "string" == typeof r)
                return this.route(r);
            if ("function" == typeof r && r.apply(null, i),
            r instanceof Element) {
                if (this.now = r,
                e.handler) {
                    let t = t=>{
                        e.handler.handle ? e.handler.handle(t) : e.handler.html(t)
                    }
                    ;
                    "function" == typeof e.handler ? e.handler(r) : "string" == typeof e.handler ? O.ready.then(()=>(e.handler = e.handler.get()) && t(r)) : t(r)
                }
                r.once ? (r.once.apply(r, i),
                delete r.once) : r.wake && r.wake.apply(r, i)
            }
            window.history[(n ? "push" : "replace") + "State"](t, null, "#/" + t)
        }
    }, {
        now(e) {
            this.now && this.now.idle && this.now.idle();
            let t = e.name;
            if (isFinite(t) && "function" != typeof O.i18n) {
                let e = this.title;
                t = O.i18n.get(t).then(t=>{
                    e.set({
                        page: t || ""
                    })
                }
                )
            } else
                this.title.set({
                    page: t || ""
                })
        }
    }),
    e.Nav && (O.Page.Nav = 1 == e.Nav ? "Nav".init() : e.Nav),
    Object.keys(e.routes).forEach(t=>{
        O.Page.routes[t] = e.routes[t]
    }
    );
    return O.ready.then(function() {
        var e;
        (e = "title".get()).length || document.head.append(e = ["title".init()]),
        -1 == e[0].innerHTML.indexOf("pageâ‚º") && e[0].set("pageâ‚º"),
        this.title = e[0],
        this.route(decodeURI(location.hash.substring(2)), 1),
        window.onpopstate = this.route.bind(this)
    }
    .bind(O.Page)),
    O.Page
}
let Disk = new Proxy({
    expire: function(e, t) {
        Disk[e + ":expire"] = Math.floor(+new Date / 1e3) + Number(t)
    },
    rem: e=>{
        "string" == typeof e && (e = [e]),
        e.forEach(e=>{
            localStorage.removeItem(e)
        }
        )
    }
},{
    get: (e,t)=>{
        if (e[t])
            return e[t];
        let n;
        if ((n = localStorage.getItem(t + ":expire")) && Number(n) < Math.floor(+new Date / 1e3))
            return delete Disk[t],
            null;
        t = localStorage.getItem(t);
        try {
            return JSON.parse(t)
        } catch (e) {
            return t
        }
    }
    ,
    set: (e,t,n)=>(localStorage.setItem(t, JSON.stringify(n)),
    !0),
    deleteProperty: (e,t)=>(localStorage.removeItem(t),
    !0),
    has: (e,t)=>!!localStorage[t]
});
DOM(global$1),
"img".prop({
    once() {
        consoe.log("once")
    }
}).set("img.jpg");
var telif = ".telif".set("Copyright yÄ±lâ‚º yazarâ‚º", {
    "yÄ±l": (new Date).getFullYear(),
    yazar: "TasarÄ± Ä°yesi"
})
  , yeterge = ".yeterge".set("Yeterge yetergeâ‚º", {
    yeterge: "MIT"
})
  , yasal = "yasal".has({
    telif: telif,
    yeterge: yeterge
});
DOM(global$1 || window);
let APP = {
    index: index,
    yasal: yasal
};
Page(APP);
