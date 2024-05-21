'use strict'

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: { 
    main: './src/js/main.js',
    githubget: './src/js/githubget.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html', favicon: './src/favicon/favicon-32x32.png' }),
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
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/images', to: 'images' },
      ],
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
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
                  autoprefixer,
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      { 
        test: /\.afm$/, 
        type: 'asset/source' 
      },
      {
        test: /src[/\\]includes/,
        type: 'asset/resource',
      },
      {
        enforce: 'post',
        test: /fontkit[/\\]index.js$/,
        loader: 'transform-loader',
        options: {
          brfs: {},
        },
      },
      {
        enforce: 'post',
        test: /linebreak[/\\]src[/\\]linebreaker.js/,
        loader: 'transform-loader',
        options: {
          brfs: {},
        },
      },
    ],
  },
  resolve: {
    alias: {
      fs: 'pdfkit/js/virtual-fs.js',
      'iconv-lite': false,
    },
    fallback: {
      crypto: false,
      buffer: require.resolve('buffer/'),
      stream: require.resolve('readable-stream'),
      zlib: require.resolve('browserify-zlib'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
    },
  },
};