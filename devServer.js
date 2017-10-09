
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const path = require('path');

config.entry.app.unshift('webpack-dev-server/client?http://localhost:3000/', 'webpack/hot/dev-server');
config['devtool'] = 'eval-source-map';
config['plugins'].push(
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NamedModulesPlugin()
);

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true,
	quiet: false,
	inline: true,
	historyApiFallback: true,
}).listen(3000, 'localhost', function (err, result) {
	if (err) {
		return console.log(err);
	}
	console.log('Listening at http://localhost:3000/');
});