const webpackConfig = require('./webpack.config')({}, {mode: 'production'});
const compiler = webpack(webpackConfig);

module.exports = compiler;
