const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './src/script.js',
	mode: 'development',
	output: {
		filename: 'main_bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader',],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],
};