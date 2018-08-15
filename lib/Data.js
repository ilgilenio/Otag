let Dizi=function(data){
	let dizi
	,	i 	= 0 	
	,	obj = {
		step:function(to){
			i = this[(to?'next':'prev')+'Key']
			return dizi.is
		},
		nextKey:function(){
			let l= dizi.length
			return i+1>=l?0:i+1
		},
		prevKey:function(){
			let l= dizi.length
			return i-1<0?l:i-1
		},
		next:function(){
			return this.step(1)
		},
		prev:function(){
			return this.step()
		},
		is:function(){
			return dizi[i]
		}
	}
	let ext=Object.keys(obj)
	ext.shift()
	return dizi=new Proxy(data||[],{
		get:function(o,k){
			if(ext.indexOf(k)>-1){
				return obj[k]()
			}else{
				return o[k]
			}
		},
		set:function(o,k,v){
			o[k]=v
			return 1
		}
	});
}