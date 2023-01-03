const webpackConfig = require('./webpack.config')({}, {mode: 'development'});
const compiler = webpack(webpackConfig);

module.exports = compiler;
