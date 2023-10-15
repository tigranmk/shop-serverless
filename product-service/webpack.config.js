const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  devtool: 'source-map',
  externals: [nodeExternals()],
  mode: slsw.lib.webpack.isLocal ? 'development': 'production',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    plugins:  [new TsconfigPathsPlugin({ configFile: './tsconfig.paths.json' })]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'ts-loader' },

    ],
  },
};