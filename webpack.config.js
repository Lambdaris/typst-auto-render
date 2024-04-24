const path = require('path');

module.exports = {
  entry: './auto-render.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'typst-auto-render.js'
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ]
  },
  performance: {
    maxAssetSize: 16777216,
    maxEntrypointSize: 524288
  }
};