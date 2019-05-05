const path = require('path')

module.exports = {
	target: 'node',
	node: {
		__filename: true,
		__dirname: true,
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	output: {
		path: path.join(__dirname, '..', '..', 'build'),
		filename: 'server.js',
	},
}
