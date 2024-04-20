const path = require('path');

module.exports = {
  entry: './auto-render.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'typst-auto-render.js'
  }
};