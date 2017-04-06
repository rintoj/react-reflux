module.exports = {
  context: __dirname + '/src',
  entry: './index.ts',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'tslint',
      include: __dirname + './src',
      enforce: 'pre'
    }, {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader'
    }]
  }
}