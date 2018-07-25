'use strict'
'use esversion:6'
let webpack = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, '0.0.0.0', function (err) {
  if (err) throw new Error(err);
  console.log('Listening at 0.0.0.0:3000')
});
