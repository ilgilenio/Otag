/*
    let chain=O.Chain([f(),g(),h()]);
    chain(ilkİşleveGirdiler).then(başarı).catch(başarısız);

    f   : işlevler Dizisi
    obj : this olacak Nesne

    Birinin çıktısı bir sonrakinin girdisi olacak şekilde işlevleri sırayla çağırır. 
    Zincir tamamlanınca çözülecek bir Söz döndürür.
  */
export default class Chain{
  constructor (f){
    var obj = this || null
    return function (){
      let args = arguments
      obj = this || obj
      return new Promise(function (res,rej){
        var prom = f.shift().prom().apply(obj,args),i
        while(i = f.shift()){
          prom = prom.then(i).catch(rej)
        }
        prom.then(res).catch(rej)
     })
    }
  }
}