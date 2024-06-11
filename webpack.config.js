'use strict';


const path = require('path');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const nav_inject = require('./src/js/insert_nav');

const htmlWebpackPluginConfig = (template, filename, chunks) => ({
    template,
    filename,
    chunks,
    inject: 'body',
    meta:{
        "Content-Security-Policy": {
          "http-equiv": "Content-Security-Policy",
          content: "default-src * 'unsafe-inline' 'unsafe-eval' ",
        },
          robots: "index,follow",
          googlebot: "index,follow",}
});

module.exports = {
    context: __dirname,
    mode: 'production',
    entry: {
        main: './src/js/main.js',
        style: './src/js/style.js',
        githubget: './src/js/githubget.js',
        html_highlight: './src/js/html_highlight.js',
        adjust: './src/js/adjustment.js',
        yay: './src/js/yay.mjs',
        pdf_style: './src/js/pdf_style.js',
        add:'./src/js/add.js',
        test: './src/js/test.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
        assetModuleFilename: './[name][ext]',
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'), publicPath: '/'},
        port: 8080,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/index.html', 'index.html', ['main','style','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/about.html', 'about.html', ['main','style','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/teaching.html', 'teaching.html', ['main','style','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/teaching_tools.html', 'teaching_tools.html', ['main','style','html_highlight','adjust','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/research.html', 'research.html', ['main','style','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/coding_show.html', 'coding_show.html', ['main','style','githubget','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/coding_explain.html', 'coding_explain.html', ['main','style','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/connect.html', 'connect.html', ['main','style','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/cv.html', 'cv.html', ['main','style','add','test'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/view.html', 'view.html', ['main','yay','pdf_style','style','add'])),
        new MiniCssExtractPlugin({filename: 'css/[name].css',}),
        new FaviconsWebpackPlugin({logo: './src/images/icon2.png',cache: true,
        outputPath: 'favicon/',
        
        favicons: {icons: {
            appleStartup: false, 
            windows: false,
            yandex: true,
          }},
          inject: true,}),

        
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/images',
                    to: 'images'
                },
                {
                    from: 'src/includes',
                    to: 'files'
                },
                {
                    from: 'src/calc.html',
                    to: 'calc.html'
                },
            ],
        }),
        new nav_inject({ options: "" }),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
          })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                generator:{
                    publicPath: 'css/',
                    outputPath: 'css/',
               }
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
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
                type: 'asset/resource',
                generator: {
                    publicPath: 'css/fonts/',
                    outputPath: 'css/fonts/'
                  },
              },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
              keep_classnames: true,
            },
          }),
           new CssMinimizerPlugin(),
        ],
      },
};