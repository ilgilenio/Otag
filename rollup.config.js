import {terser} from 'rollup-plugin-terser'
export default [
  {
    input: './o.js',
    output: {
      file: './dist/o.js',
      format: 'cjs'
    },
    plugins:[
      terser()
    ]
  },
  {
    input: './lib/DOM.js',
    output: {
      file: './dist/lib/DOM.js',
      format: 'esm'
    },
    plugins:[
      terser()
    ]
  },
  {
    input: './lib/Page.js',
    output: {
      file: './dist/lib/Page.js',
      format: 'esm'
    },
    plugins:[
      terser()
    ]
  }
    
]