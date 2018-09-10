'use strict'
import DOM from './lib/DOM'

import Time from './lib/Time'
import Chain from './lib/Chain'
import Sanal from './lib/Sanal'
import Page from './lib/Page'
import Tor from './lib/Tor'

import Disk from './lib/Disk'

let O = {
  require(js, path = '') {
    return Tor.req(path + js + '.js').then(code => {
      let module = {}, window
      eval(code)
      return module.exports
    })
  },
  define(cls, methods) {
    if(!this[cls]) {
      this[cls] = {}
    }
    Object.keys(methods).forEach((i) => {
      this[cls][i] = methods[i]
    })
  },
  UI: {
    M() {
      let a = O.toArray(arguments)
      return O.Model[a.shift()].apply('', a)
    }
  },
  req: Tor.req,
  Model: {},
  toArray: o => Object.keys(o).map(i => o[i]),
  ready: new Promise((res) => {
    document.addEventListener('DOMContentLoaded', () => {
      let {body, head} = document
      res({body, head})
    })
  })
}
export default O
export {Time, Chain, Tor, Page, Disk, Sanal, O}