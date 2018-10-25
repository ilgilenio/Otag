let now = () => Math.floor(+new Date() / 1000)
let Disk = new Proxy({
  expire: new Proxy({}, {
    set(o, k, v) {
      k = Disk.ƒscope ? (Disk.ƒscope + '_' + k) : k
      localStorage.setItem(k + ':expire', now() + Number(v))
      return true
    }
  }),
  rem: k => {
    if(typeof k == 'string') { k = [k] }
    if(typeof Disk.ƒscope == 'string') {
      k = k.map(i => Disk.ƒscope + '_' + i)
    }
    k.forEach(i => {
      localStorage.removeItem(i)
    })
  }
}, {
  get: (o, k) => {
    if(o[k]) { return o[k] }
    let e
    k = o.ƒscope ? o.ƒscope + '_' + k : k
    if(e = localStorage.getItem(k + ':expire')) {
      if(Number(e) < now()) {
        localStorage.removeItem(k)
        return null
      }
    }
    k = localStorage.getItem(k)
    try{
      return JSON.parse(k)
    } catch(Exception) {
      return k
    }
  },
  set: (o, k, v) => {
    if(k == 'ƒscope') {
      o.ƒscope = v
      return true
    }
    k = o.ƒscope ? o.ƒscope + '_' + k : k

    localStorage.setItem(k, JSON.stringify(v))
    return true
  },
  deleteProperty: (o, k) => {
    k = o.ƒscope ? o.ƒscope + '_' + k : k

    localStorage.removeItem(k)
    return true
  },
  has: (o, k) => {
    k = o.ƒscope ? o.ƒscope + '_' + k : k

    return !!localStorage[k]
  }
})

export default Disk