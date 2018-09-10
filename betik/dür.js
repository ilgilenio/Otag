const uglify = require('uglify-js-es6')
const rollup = require('rollup')
const fs = require('fs')
const zlib = require('zlib')

let mini = '/* 2017 - 2018 ⊕ Otağ ' + require('./../package.json').version
let banner = `/*
 *           ██████████             ` + mini + `
 *        █████      █████
 *      ████     ██     ████
 *    ███        ██        ███       .8888888.    dP              88b
 *   ██                      ██     d8'     \`8b   88
 *   ██   █████  ██  █████   ██     88       88 d8888P .d8888b. .d8888b.
 *   ██                      ██     88       88   88   88'  \`88 88'  \`88
 *    ███        ██        ███      Y8.     .8P   88   88.  .88 88.  .88
 *      ████     ██     ████         \`888888P'    \`88P \`88888P8 \`8888P88
 *        █████      █████                                           .88
 *           ██████████                       https://otagjs.org d8888P
 *                                                                 
 */
`

let code = uglify.minify('dist/otag.js', {
  output: {
    ascii_only: true
  },
  ecma: 8,
  compress: {
    pure_funcs: ['makeMap']
  },
  toplevel: true,
  compress: {
    global_defs: {
      '@console.log': 'alert'
    },
    passes: 2
  },
  output: {
    beautify: false,
    preamble: '/* uglified */'
  }
}).code
let Size = s => Math.round(s / 10.24) / 100 + 'KB'
let space = '                                    '
fs.writeFile('dist/o.min.js', mini + '\n * https://otagjs.org\n */\n' + code, err => {
  console.log(banner)
  console.log(space + 'uzunluk :', Size(code.length))
  zlib.gzip(code, (err, zip) => {
    console.log(space + 'gzip    :', Size(zip.length))
  })
})
fs.writeFileSync('dist/otag.js', banner + fs.readFileSync('dist/otag.js', 'utf-8'))