'use strict';

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './docs/scripts.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
    clean: false,
  },
  resolve: {
    alias: {
      'poly-pals': path.resolve(__dirname),
    },
  },
};
