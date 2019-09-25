const prod = process.env.NODE_ENV === 'production'

module.exports = {
  mode: prod ? 'production' : 'development',
  output: {
    filename: 'maska.js',
    library: 'Maska',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
