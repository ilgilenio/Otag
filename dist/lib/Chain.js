"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
    let chain=O.Chain([f(),g(),h()]);
    chain(ilkİşleveGirdiler).then(başarı).catch(başarısız);

    f   : işlevler Dizisi
    obj : this olacak Nesne

    Birinin çıktısı bir sonrakinin girdisi olacak şekilde işlevleri sırayla çağırır. 
    Zincir tamamlanınca çözülecek bir Söz döndürür.
  */
var Chain = function Chain(f) {
  _classCallCheck(this, Chain);

  var obj = this || null;
  return function () {
    var args = arguments;
    obj = this || obj;
    return new Promise(function (res, rej) {
      var prom = f.shift().prom().apply(obj, args),
          i;
      while (i = f.shift()) {
        prom = prom.then(i).catch(rej);
      }
      prom.then(res).catch(rej);
    });
  };
};

exports.default = Chain;