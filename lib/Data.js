let Dizi = (data)=>{
  let dizi
    ,	i 	= 0 	
    ,	obj = {
      step(to){
        i = this[(to ? 'next' : 'prev') + 'Key']
        return dizi.is
      },
      nextKey(){
        let l = dizi.length
        return i + 1 >= l ? 0 : i + 1
      },
      prevKey(){
        let l = dizi.length
        return i - 1 < 0 ? l : i - 1
      },
      next(){
        return this.step(1)
      },
      prev(){
        return this.step()
      },
      is(){
        return dizi[i]
      }
    }
  let ext = Object.keys(obj)
  ext.shift()
  return dizi = new Proxy(data || [], {
    get(o, k){
      if(ext.indexOf(k) > -1){
        return obj[k]()
      }else{
        return o[k]
      }
    },
    set(o, k, v){
      o[k] = v
      return 1
    }
  })
}
export default Dizi