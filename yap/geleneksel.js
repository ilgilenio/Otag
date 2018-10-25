'use strict'
import DOM from '../lib/DOM'

import Time from '../lib/Time'
import Chain from '../lib/Chain'
import Sanal from '../lib/Sanal'
import Page from '../lib/Page'
import Tor from '../lib/Tor'

import Disk from '../lib/Disk'

export default {
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
    Object.keys(methods).forEach(i => this[cls][i] = methods[i])
  },
  calc: (obj, features) => {
    Object.defineProperties(
      obj,
      Object
        .keys(features)
        .reduce((o, f) => {
          o[f] = {
            get: features[f].bind(obj),
            set: (v) => console.error(f, 'için değer ataması yapılamaz.')
          }
          return o
        }, {})
    )
    return obj
  },
  UI: {
    M: (...args) => O.Model[args.shift()].apply('', args)
  },
  req: Tor.req,
  Model: {},
  ready: new Promise((res) => {
    document.addEventListener('DOMContentLoaded', () => {
      let {body, head} = document
      res({body, head})
    })
  }),
  Time,
  Chain,
  Page,
  Disk
}