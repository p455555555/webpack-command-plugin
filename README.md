[![npm version](https://badge.fury.io/js/webpack-command-plugin.svg)](https://badge.fury.io/js/webpack-command-plugin)

# Webpack Command Plugin

这个是[WebpackShellPlugin](https://github.com/1337programming/webpack-shell-plugin)的TypeScript重构版，以webpack4新hooks API为基础重构,API用法保持不变.

## 安装

`npm install --save-dev webpack-command-plugin`

## 用法
In `webpack.config.js`:

```js
const WebpackCommandPlugin = require('webpack-command-plugin');

module.exports = {
  ...
  ...
  plugins: [
    new WebpackCommandPlugin({onBuildStart:'echo "Webpack Start"', onBuildEnd:'echo "Webpack End"'})
  ],
  ...
}
```

## 示例

Insert into your webpack.config.js:

```js
const WebpackCommandPlugin = require('webpack-command-plugin');
const path = require('path');

var plugins = [];

plugins.push(new WebpackCommandPlugin({
  onBuildStart: 'echo "Starting"',
  onBuildEnd: 'python script.py && node script.js'
}));

var config = {
  entry: {
    app: path.resolve(__dirname, 'src/app.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // regular webpack
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src') // dev server
  },
  plugins: plugins,
  module: {
    loaders: [
      {test: /\.js$/, loaders: 'babel'},
      {test: /\.scss$/, loader: 'style!css!scss?'},
      {test: /\.html$/, loader: 'html-loader'}
    ]
  }
}

module.exports = config;

```
