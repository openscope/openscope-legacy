
var path = require('path');

module.exports = {
  entry: './src/main.js',
  devtool: 'source-map',
  target: 'web',
  
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/build/",
    filename: 'bundle.js'
  },

  node: {
    fs: "empty"
  },

  module: {
    loaders: [
      {
        test: /render[\/\\]shaders\.js$/,
        loader: 'transform/cacheable',
        query: "brfs"
      },
      {
        test: /[\/\\]webworkify[\/\\]index.js\.js$/,
        loader: 'worker'
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'node_modules/mapbox-gl/js/render/painter/use_program.js'),
        loader: 'babel-loader!transform/cacheable?brfs'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  
  resolve: {
    extensions: ['', '.js', '.scss'],
    
    alias: {
      webworkify: 'webworkify-webpack'
    },
    
    root: [
      path.resolve(path.join(__dirname, 'src'))
    ]
  }
};
