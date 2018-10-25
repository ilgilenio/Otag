import {O, Page} from '../yap/ES6.js'

let Kabuk = 'Kabuk'.kur({
  View: {
    yönlendir: 'Yönlendir'.kur({
      View: {
        imlek: 'img:./img/o.min.svg',
        dizelge: ''
      },
      template: `
        a[href="./#/ana"]
          imlek
        dizelge
      `
    }),
    taşıyıcı: 'Taşıyıcı'
  }
})

let routes = {
  index: 'ana',
  ana: 'Ana Bet'.kur({
    View: {
      img: 'img:./img/otag.svg',
      açıklama: '.desc:Otağ\'a Hoşgeldiniz'
    },
  	once() {
  		this.V('img').el.loader.then(() => this.V('açıklama').el.Class('açık'))
  	},
  	name: 'Ana Bet'
  }),
  hakkında: 'Hakkında Bet'.kur({
    View: {
      açıklama: '.açıklama'
    },
  	once() {
  		this.V('açıklama').value = 'Otağ MIT yetergesiyle yayımlanan bir JS Çatısıdır'
      this.V('açıklama').el.Class('açıklama')
  	},
  	name: 'Hakkında'
  })
}

let Uygulama = new Page({routes, handler: Kabuk.V('taşıyıcı').el})
Uygulama.Navigation({hide: ['ana']}).to = Kabuk.V('yönlendir:dizelge').el
Kabuk.to = 'body'

// Sınama İçin
Uygulama.O = O
export default Uygulama