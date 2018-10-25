let Chain = function(f) {
  let obj = this || null

  return function(...args) {
    obj = this || obj

    return new Promise((res, rej) => {
      let prom = f.shift().prom()
          .apply(obj, args), i
      while(i = f.shift()) {
        prom = prom.then(i).catch(rej)
      }
      prom.then(res).catch(rej)
    })
  }
}

export default Chain