'use strict';
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const nav_inject = require('./src/js/insert_nav');
const htmlWebpackPluginConfig = (template, filename, chunks) => ({
	template,
	filename,
	chunks,
	inject: 'body',
	favicon: './src/images/icon2.png',
	meta: {
		robots: "index,follow",
		googlebot: "index,follow",
	}
});
module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	return {
	context: __dirname,
	mode: isProduction ? 'production' : 'development',
	entry: {
		main: ['./src/js/main.js'],
		githubget: './src/js/githubget.js',
		html_highlight: './src/js/html_highlight.js',
		adjust: {
			import: './src/js/adjustment.js',
			dependOn: 'main'
		},
		to_html: ['./src/pdf_js_generic/web/viewer.css', './src/pdf_js_generic/build/pdf.mjs', './src/pdf_js_generic/web/viewer.mjs'],
		pdf_viewer_element: './src/js/pdf_viewer_element.js',
		gh_card: ['./src/js/github_profile.js'],
	},
	output: {
		filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		clean: true,
		assetModuleFilename: './[name][ext]',
	},
	module: {
		rules: [{
				test: /\.css$/,
				use: [{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
				type: 'asset/resource',
				generator: {
					publicPath: '/css/fonts/',
					outputPath: 'css/fonts/'
				},
			},
		],
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
			publicPath: '/'
		},
		port: 8080
	},
	plugins: [
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/index.html', 'index.html', ['main'])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/about.html', 'about.html', ['main'])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/teaching.html', 'teaching.html', ['main'])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/teaching_tools.html', 'teaching_tools.html', ['main', 'html_highlight', 'adjust','pdf_viewer_element'
		])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/research.html', 'research.html', ['main'])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/coding_show.html', 'coding_show.html', ['main', 'githubget'])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/coding_explain.html', 'coding_explain.html', ['main'])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/connect.html', 'connect.html', ['main', 'gh_card'])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/cv.html', 'cv.html', ['main', 'pdf_viewer_element'])),
		new HtmlWebpackPlugin(htmlWebpackPluginConfig('./src/pdf_js_generic/web/viewer.html', './pdf_js/web/viewer.html', ['to_html'])),
		new MiniCssExtractPlugin({
			filename: isProduction ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
		}),
		new CopyWebpackPlugin({
			patterns: [{
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
			],
		}),
		new nav_inject({
			options: ""
		}),

	],
	optimization: {
		minimize: isProduction,
		splitChunks: {
			chunks: 'all',
		},
		minimizer: ['...', new CssMinimizerPlugin()],
	},
	};
};
