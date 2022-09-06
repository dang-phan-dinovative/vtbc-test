const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
require('dotenv').config({ path: './.env' })
module.exports = {
  entry: './src/index.tsx', // Dẫn tới file index.js ta đã tạo
  output: {
    path: path.resolve(__dirname, './build'), // Thư mục chứa file được build ra
    filename: '[name].bundle.js' // Tên file được build ra
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/, // Loại trừ thư mục node_modules
        use: [ 'babel-loader' ]
      },
      {
        test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin()
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      '@root': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  },
  devServer: {
    host: 'localhost',
    static: {
      directory: path.join(__dirname, 'public')
    },
    historyApiFallback: true,
    compress: true,
    port: process.env.REACT_RUNNING_PORT || 3300
  }
}
