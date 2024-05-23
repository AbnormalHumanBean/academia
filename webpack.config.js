'use strict';
const path = require('path');
const webpack = require("webpack"); 
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlWebpackPluginConfig = (template, filename, chunks) => ({
  template,
  filename,
  chunks,
  inject: 'body',
});

module.exports = {
  context: __dirname,
  mode: 'none',
  entry: {
    main: './src/js/main.js',
    githubget: './src/js/githubget.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/index.html', 'index.html', ['main'])),
    new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/about.html', 'about.html', ['main'])),
    new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/resources.html', 'resources.html', ['main'])),
    new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/explore.html', 'explore.html', ['main', 'githubget'])),
    new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/research.html', 'research.html', ['main'])),
    new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/resources_research.html', 'resources_research.html', ['main'])),
    new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/teaching.html', 'teaching.html', ['main'])),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/css', to: 'css' },
        { from: 'src/favicon', to: 'favicon' },
        { from: 'src/images', to: 'images' },
        { from: 'src/includes', to: 'includes' },
      ],
    }),
    function () {
      this.hooks.compilation.tap('HtmlWebpackPlugin', (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'InjectCssPlugin',
          (data, cb) => {
            const stylesheets = [
              '<link rel="stylesheet" href="css/styles.css">',
              '<link rel="stylesheet" href="css/additions.css">',
              '<link rel="stylesheet" href="css/icofont.css">',
              '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">'
            ];
            data.html = data.html.replace(
              '</head>',
              stylesheets.join('\n') + '\n</head>'
            );
            cb(null, data);
          }
        );
      });
    }
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
                plugins: [autoprefixer],
              },
            },
          },
          'sass-loader',
        ],
      },
      { test: /\.svg$/,
      loader: 'svg-url-loader',
      options: {
        // Images larger than 10 KB won’t be inlined
        limit: 10 * 1024,
        // Remove quotes around the encoded URL –
        // they’re rarely useful
        noquotes: true,
      }
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
          // Images larger than 10 KB won’t be inlined
          limit: 10 * 1024
        }
      }
    ],
  },
  optimization: {
    minimize: true,
  },
};