const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/renderer/index.tsx',
  target: 'web', // Changed from 'electron-renderer' to 'web'
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      "fs": false,
      "path": false,
      "crypto": false,
      "stream": false,
      "util": false,
      "buffer": false,
      "process": false,
      "os": false,
      "child_process": false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.renderer.json',
            transpileOnly: true,
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
    }),
    new webpack.DefinePlugin({
      'global': 'globalThis',
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  devtool: 'source-map',
};