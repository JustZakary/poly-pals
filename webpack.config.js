'use strict';

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './site/scripts.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'site'),
    clean: false,
  },
  resolve: {
    alias: {
      'poly-pals': path.resolve(__dirname),
    },
  },
};
