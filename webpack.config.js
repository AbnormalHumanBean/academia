'use strict';
const stylesheets = ['<link rel="stylesheet" href="css/styles.css">','<link rel="stylesheet" href="css/additions.css">','<link defer rel="stylesheet" href="css/icofont.css">','<link defer rel="stylesheet" href="css/icons.css">','<link defer rel="stylesheet" href="css/bootstrap-icons.css">','<script defer src="https://kit.fontawesome.com/33332c4d45.js" crossorigin="anonymous"></script>','<link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">','<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">','<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">','<link rel="manifest" href="favicon/site.webmanifest"></link>'];
const nav = ['<nav class="navbar fixed-top navbar-expand-sm bg-body-tertiary bg-nav"> <a class="navbar-brand" href="#"> <img src="images/icon2.png" alt="the letter i with the letter p" width="35" height="35" /> </a> <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarSupportedContent"> <ul class="navbar-nav me-auto mb-2 mb-lg-0"> <li class="nav-item"> <a class="nav-link data-bs-display="static" data-bs-toggle="tooltip" title="The landing Page" href="index.html">Welcome</a> </li> <li class="nav-item"> <a class="nav-link" href="about.html">About</a> </li> <li class="nav-item"> <a class="nav-link" href="research.html">Research</a> </li> <li class="nav-item dropdown"> <div class="btn-group"> <a class="split-nav-a dropdown-link nav-link" href="teaching.html">Teaching</a> <a class="split-nav-b dropdown-toggle dropdown-toggle-split nav-link" href="#" id="teach" role="button" data-bs-toggle="dropdown" aria-expanded="false"> </a> <ul class="dropdown-menu"> <li><a class="dropdown-item" href="teaching_tools.html">Tools & Examples</a></li> </ul> </div> </li> <li class="nav-item dropdown"> <a class="nav-link dropdown-toggle dropdown-link px-0 px-lg-2" href="#" id="code" role="button" data-bs-toggle="dropdown" aria-expanded="false"> CodeBox </a> <ul class="dropdown-menu"> <li><a class="dropdown-item" href="coding_show.html">Show Coding</a></li> <li><a class="dropdown-item" href="coding_explain.html">Explain Coding</a></li> </ul> </li> </ul> <ul class="navbar-nav ms-0 me-1"> <li class="nav-item"> <a class="nav-link" href="connect.html">Connect</a> <li class="nav-item"> <a class="nav-link" href="cv.html">CV</a> </li> <li class="nav-item py-2 px-1"> <div class="vr h-100 d-flex opacity-75"> </div> </li> <li class="nav-item dropdown"> <a href="#" class="nav-link px-0 px-lg-2 dropdown-toggle d-flex align-items-center show" id="bd-color-mode" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static" data-bs-toggle="tooltip" title="Toggle color mode"> <span class="d-light"> <i class="bi bi-brightness-high-fill"></i> </span> <span class="d-dark"> <i class="bi bi-moon-stars-fill"></i> </span> <span class="d-auto"> <i class="bi bi-circle-half"></i> </span> </a> <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-color-mode" style="--bs-dropdown-min-width: 6rem;" data-bs-popper="static"> <li> <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false"> <i class="bi bi-brightness-high-fill"></i> <span class="ms-2">Light</span> </button> </li> <li> <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false"> <i class="bi bi-moon-stars-fill"></i> <span class="ms-2">Dark</span> </button> </li> <li> <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="auto" aria-pressed="true"> <i class="bi bi-circle-half"></i> <span class="ms-2">Auto</span> </button> </li> </ul> </li> </ul> </div> </nav>'];

const path = require('path');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const htmlWebpackPluginConfig = (template, filename, chunks) => ({
    template,
    filename,
    chunks,
    inject: 'body',
});

module.exports = {
    context: __dirname,
    mode: 'production',
    entry: {
        main: './src/js/main.js',
        githubget: './src/js/githubget.js',
        html_highlight: './src/js/html_highlight.js',
        adjust: './src/js/adjustment.js',
        adobe_api: './src/js/adobe_api.js'
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
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/teaching.html', 'teaching.html', ['main'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/teaching_tools.html', 'teaching_tools.html', ['main','html_highlight','adjust'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/research.html', 'research.html', ['main'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/coding_show.html', 'coding_show.html', ['main', 'githubget'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/coding_explain.html', 'coding_explain.html', ['main'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/connect.html', 'connect.html', ['main'])),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/cv.html', 'cv.html', ['main','adobe_api'])),
        
        
        new CopyWebpackPlugin({
            patterns: [{
                    from: 'src/css',
                    to: 'css'
                },
                {
                    from: 'src/favicon',
                    to: 'favicon'
                },
                {
                    from: 'src/images',
                    to: 'images'
                },
                {
                    from: 'src/includes',
                    to: 'includes'
                },
                {
                    from: 'src/calc.html',
                    to: 'calc.html'
                },
            ],
        }),
        function() {
            this.hooks.compilation.tap('HtmlWebpackPlugin', (inject) => {
                HtmlWebpackPlugin.getHooks(inject).beforeEmit.tapAsync(
                    'InjectCssPlugin',
                    (data, cb) => {stylesheets + nav;
                        data.html = data.html.replace(
                            "</head>",
                            stylesheets.join("\n") + "\n</head>" + "\n<body>" + nav.join("\n")
                        );
                        cb(null, data);
                    }
                );
            });
        },
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
          })
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
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                    limit: 10 * 1024,
                    noquotes: true,
                }
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                loader: 'url-loader',
                options: {
                        limit: 10 * 1024
                }
            }
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
              keep_classnames: true,
            },
          }),],
      },
};