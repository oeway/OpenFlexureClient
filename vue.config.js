var webpack = require('webpack');

module.exports = {
  configureWebpack: config => {
    config.target = process.env.VUE_APP_TARGET || 'web',
    config.entry = (process.env.VUE_APP_TARGET == 'electron-renderer')
    ? {
      main: './src/main.js',
      app: './src/main.app.js'
    }
    :{
      main: './src/main.js',
    },
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE: JSON.stringify(require('./package.json'))
        }
      })
    )
  },
  outputDir: (process.env.VUE_APP_TARGET == 'electron-renderer') ? './app/dist' : './dist',
  publicPath: ''
}
