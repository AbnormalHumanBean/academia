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
const FileManagerPlugin = require('filemanager-webpack-plugin');

const htmlWebpackPluginConfig = (template, filename, chunks) => ({
    template,
    filename,
    chunks,
    inject: 'body',
    meta:{
          robots: "index,follow",
          googlebot: "index,follow",}
});

module.exports = {
    context: __dirname,
    mode: 'production',
    entry: {
        main: ['./src/js/main.js'],
        style: './src/css/styles.css',
        githubget: './src/js/githubget.js',
        html_highlight: './src/js/html_highlight.js',
        adjust: './src/js/adjustment.js',
        add: ['./src/css/additions.css', './src/css/icofont.css','./src/css/icons.css','./src/css/bootstrap-icons.css'],
        to_html:['./src/pdf_js_generic/web/viewer.css','./src/pdf_js_generic/build/pdf.mjs','./src/pdf_js_generic/web/viewer.mjs'],
        pdf_viewer_element: './src/js/pdf_viewer_element.js',
        gh_card: ['./src/mine/github_profile.js'],
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
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/teaching_tools.html', 'teaching_tools.html', ['main','style','html_highlight','adjust','add','pdf_viewer_element'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/research.html', 'research.html', ['main','style','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/coding_show.html', 'coding_show.html', ['main','style','githubget','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/coding_explain.html', 'coding_explain.html', ['main','style','add'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/connect.html', 'connect.html', ['main','style','add','gh_card'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/cv.html', 'cv.html', ['main','style','add', 'pdf_viewer_element'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/pdf_js_generic/web/viewer.html', './pdf_js/web/viewer.html', ['to_html'])),
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
                    from: 'src/_headers.txt',
                    to: '_headers.txt'
                },
                {
                    from: 'src/includes',
                    to: 'files'
                },
                {
                    from: 'src/calc.html',
                    to: 'calc.html'
                },
                {
                    from: 'src/pdf_js_generic/web/cmaps',
                    to: 'pdf_js/web/cmaps'
                },
                {
                    from: 'src/pdf_js_generic/web/images',
                    to: 'pdf_js/web/images'
                },
                {
                    from: 'src/pdf_js_generic/web/locale',
                    to: 'pdf_js/web/locale'
                },
                {
                    from: 'src/pdf_js_generic/build/pdf.worker.mjs',
                    to: 'pdf_js/build/pdf.worker.mjs'
                },
                {
                    from: 'src/mine',
                    to: 'mine'
                },
            ],
        }),
        new nav_inject({ options: "" }),
        new FileManagerPlugin({
            events: {
                onEnd: { 
                    move: [
                    { source: 'dist/to_html.js', destination: 'dist/pdf_js/build/to_html.js' },
                    { source: 'dist/css/to_html.css', destination: 'dist/pdf_js/web/to_html.css' },
                  ],},},}),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
          }),
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
            compress: true,
              keep_classnames: true,
            },
          }),
           new CssMinimizerPlugin(),
        ],
      },
};