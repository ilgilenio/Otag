Dizi = (data)=>{
  let dizi
    , interval = false
    ,	i = 0 
    , step = function(to){
      i = dizi[(to ? 'next' : 'prev') + 'Key']
      debugger
      return dizi.value
    }
    ,	shadow = {
      get nextKey(){
        let l = dizi.length
        return i + 1 >= l ? 0 : i + 1
      },
      get prevKey(){
        let l = dizi.length
        return i - 1 < 0 ? l : i - 1
      },
      get next(){
        return step(this, 1)
      },
      get max(){
        return dizi.reduce((max, key)=>{
          return key > max ? key : max
        }, -Infinity)
      },
      get min(){
        return dizi.reduce((min, key)=>{
          return min > key ? key : min
        }, Infinity)
      },
      get prev(){
        return step(this)
      },
      get value(){
        return dizi[i]
      },
      set interval({val}){
        if(interval){
          clearInterval(interval)
        }
        interval = setInterval(()=>step(dizi, 1), val)
      },
      set value({store, val}){
        if(val instanceof Array){
          store.splice(0, 1500)
          while(val.length){
            store.push.apply(dizi, val.splice(0, 500))
          }
        }else{
          i = val
        }
      } 
    }
  let ext = Object.keys(shadow)
  data[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
  }
  return dizi = new Proxy(data || [], {
    get(store, key){
      if(ext.indexOf(key) > -1){
        return shadow[key]
      }else{
        return store[key]
      }
    },
    set(store, key, val){
      if(ext.indexOf(key) > -1){
        shadow[key] = {store, val}
        return 1
      }
      store[key] = val
      return 1
    }
  })
}