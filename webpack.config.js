const path = require('path');

module.exports = {
  entry: './auto-render.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'typst-auto-render.js'
  },
  performance: {
    maxAssetSize: 16777216,
    maxEntrypointSize: 524288
  }
};