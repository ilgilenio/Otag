let Disk = new Proxy({
  expire: function(key, time) {
    Disk[key + ':expire'] = Math.floor(+new Date() / 1000) + Number(time)
  },
  rem: k => {
    if(typeof k == 'string') { k = [k] }
    k.forEach(i => {
      localStorage.removeItem(i)
    })
  }
}, {
  get: (o, k) => {
    if(o[k]) { return o[k] }
    let e
    if(e = localStorage.getItem(k + ':expire')) {
      if(Number(e) < Math.floor(+new Date() / 1000)) {
        delete Disk[k]
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
    localStorage.setItem(k, JSON.stringify(v))
    return true
  },
  deleteProperty: (o, k) => {
    localStorage.removeItem(k)
    return true
  },
  has: (o, k) => {
    return !!localStorage[k]
  }
})
export default Disk