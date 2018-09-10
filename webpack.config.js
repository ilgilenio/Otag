var path = require('path')
var webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}
let banner = `

            ██████████             2017 - 2018 ⊕ Otag `+require('./package.json').version+`
         █████      █████
       ████     ██     ████
     ███        ██        ███       .88888.    dP              88b
    ██                      ██     d8'   \`8b   88
    ██   █████  ██  █████   ██     88     88 d8888P .d8888b. .d8888b.
    ██                      ██     88     88   88   88'  \`88 88'  \`88
     ███        ██        ███      Y8.   .8P   88   88.  .88 88.  .88
       ████     ██     ████         \`8888P'    \`888 \`88888P8 \`8888P88
         █████      █████                                         .88
            ██████████                                        d8888P
                                   
`

module.exports = {
  entry: './www/uygulama.js',
  output: {
    path: path.resolve(__dirname, './www/yay'),
    publicPath: './www/yay',
    filename: 'uygu.js'
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ],
  resolve: {
    alias: {
      '₺': resolve('/'),
      '@': resolve('/bet/')
    },
    extensions: ['*', '.js', '.odn', '.json']
  },
  devServer: {
    historyApiFallback: true,
    overlay: true
  },
  performance: false,
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  let plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
  Object.assign(module.exports, {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          sourceMap: true,
          uglifyOptions: {
            mangle: true,
            ecma: 6,
            compress: false
          },
          parallel: true
        })
      ]
    },
    devtool: '#source-map',
    plugins
  })
}