import {terser} from 'rollup-plugin-terser'
export default [
  {
    input: './o.js',
    output: {
      file: './dist/otag.js',
      format: 'umd',
      name: 'O'
    },
    env: 'development'
  },
  {
    input: './o.js',
    output: {
      file: './dist/otag.cjs.js',
      format: 'cjs',
      name: 'O'
    },
    plugins: [terser()]
  },
  {
    input: './o.js',
    output: {
      file: './dist/otag.esm.js',
      format: 'esm',
      name: 'O'
    },
    plugins: [terser()]
  },
  {
    input: './www/uygulama.js',
    output: {
      file: './www/yay/uygu.js',
      format: 'umd',
      name: 'Uygu'
    },
    env: 'development'
  },
  {
    input: './lib/Chain.js',
    output: {
      file: './dist/lib/Chain.js',
      format: 'umd',
      name: 'Chain'
    },
    env: 'development'
  },
  {
    input: './lib/Time.js',
    output: {
      file: './dist/lib/Time.js',
      format: 'umd',
      name: 'Time'
    },
    env: 'development'
  },
  {
    input: './lib/Chain.js',
    output: {
      file: './dist/lib/Chain.js',
      format: 'umd',
      name: 'Chain'
    },
    env: 'development'
  }
]