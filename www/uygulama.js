let Uygulama = 'Uygulama'.has({
  yönlendir: 'Yönlendir'.has({imlek: 'img'.set('./img/o.min.svg').link('ana'), dizelge: ''}),
  taşıyıcı: 'Taşıyıcı'
})

let routes = {
  index: 'ana',
  ana: 'Ana Bet'.has({
    img: 'img'.set('./img/otag.svg'),
    açıklama: '.desc'.set('Otağ\'a Hoşgeldiniz')
  }).prop({
  	once(){
  		this.V('img').loader.then(()=>this.V('açıklama').Class('açık'))
  	},
    
  	name: 'Ana Bet'
  }),
  hakkında: 'Hakkında Bet'.has({
    açıklama: '.açıklama'
  }).prop({
  	once(){
  		this.V('açıklama').set('Otağ MIT yetergesiyle yayımlanan bir JS Çatısıdır').Class('açıklama')
  	},
  	name: 'Hakkında'
  })
}

O.Page({hide: ['ana'], routes, handler: Uygulama.V('taşıyıcı'), Nav: Uygulama.V('yönlendir:dizelge')})

O.ready.then(b=>b.html(Uygulama))