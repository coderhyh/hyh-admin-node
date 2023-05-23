import path from 'path'
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './main.ts',
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src/')
    },
    extensions: ['*', '.ts', '.js', 'json']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()]
}
