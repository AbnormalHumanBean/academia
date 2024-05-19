'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html',  favicon: './src/favicon/favicon-32x32.png', // Add this line to include favicon
  }),
  new HtmlWebpackPlugin({ template: './src/about.html', filename: 'about.html' }),
  new HtmlWebpackPlugin({ template: './src/resources.html', filename: 'resources.html' }),
  new HtmlWebpackPlugin({ template: './src/explore.html', filename: 'explore.html' }),
  new HtmlWebpackPlugin({ template: './src/research.html', filename: 'research.html' }),
  new HtmlWebpackPlugin({ template: './src/resources_research.html', filename: 'resources._research.html' }),
  new HtmlWebpackPlugin({ template: './src/teaching.html', filename: 'teaching.html' }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'src/css', to: 'css' },
      { from: 'src/favicon', to: 'favicon' },
    ],
  }),
],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
}