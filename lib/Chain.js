let Chain = function(f) {
  let obj = this || null

  return function() {
    let args = arguments
    obj = this || obj

    return new Promise(function(res, rej) {
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