const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack
	// webpack.chainWebpack((config) => {
	// 	config.define("global.platform.match", function(platform) {
	// 		return isIOS ? "ios" : "android";
	// 	});
	// });

	return webpack.resolveConfig();
};
