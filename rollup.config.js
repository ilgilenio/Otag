import {terser} from 'rollup-plugin-terser'
export default [
  {
    input: './yap/geleneksel.js',
    output: {
      file: './dist/otag.js',
      format: 'umd',
      name: 'O'
    }
  },
  {
    input: './yap/geleneksel.js',
    output: {
      file: './dist/otag.cjs.js',
      format: 'cjs',
      name: 'O'
    },
    plugins: [terser()]
  },
  {
    input: './yap/ES6.js',
    output: {
      file: './dist/otag.esm.js',
      format: 'esm',
      name: 'O'
    },
    plugins: [terser()]
  },
  {
    input: './yap/ES6.js',
    output: {
      file: './dist/otag.esm.dev.js',
      format: 'esm',
      name: 'O'
    },
  },
  {
    input: './www/uygulama.js',
    output: {
      file: './www/yay/uygu.js',
      format: 'umd',
      name: 'Uygu'
    }
  },
  {
    input: './lib/Chain.js',
    output: {
      file: './dist/lib/Chain.js',
      format: 'umd',
      name: 'Chain'
    }
  },
  {
    input: './lib/Time.js',
    output: {
      file: './dist/lib/Time.js',
      format: 'umd',
      name: 'Time'
    }
  },
  {
    input: './lib/Chain.js',
    output: {
      file: './dist/lib/Chain.js',
      format: 'umd',
      name: 'Chain'
    }
  }
]