(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Chain = factory());
}(this, (function () { 'use strict';

  let Chain = function(f) {
    let obj = this || null;

    return function() {
      let args = arguments;
      obj = this || obj;

      return new Promise(function(res, rej) {
        let prom = f.shift().prom()
            .apply(obj, args), i;
        while(i = f.shift()) {
          prom = prom.then(i).catch(rej);
        }
        prom.then(res).catch(rej);
      })
    }
  };

  return Chain;

})));
