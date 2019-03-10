const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const plugins = [
  new MiniCssExtractPlugin({
    filename: "css/[name].css",
    chunkFilename: "[id].css"
  }),
  new HtmlWebpackPlugin({
    template: path.resolve('./frontend/public/index.html'),
    inject: true,
  })
]

module.exports = {
  context: path.join(__dirname, '../'),
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
        }, {
          loader: 'eslint-loader',
        }],
      }, {
        test: /\.(s?css)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: 'css-loader',
          options: {
            modules: true,
            minimize: true,
            localIdentName: '[hash:base64:6]',
          }
        }, {
          loader: 'sass-loader',
          options: {
            includePaths: ['./src/styles']
              .map(file => path.join(__dirname, file))
          }
        }]
      }, {
        test: /\.(eot|ttf|woff|woff2)$/,
        loaders: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[hash].[ext]',
          },
        }, ],
      }, {
        test: /.*\.(png|jpe?g|svg)$/i,
        loaders: [{
          loader: 'file-loader',
          options: {
            name: 'images/[hash].[ext]',
          },
        }, {
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true,
          },
        }, ],
      }, {
        test: /\.gql$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },

    ]
  },
  plugins,
  devtool: "inline-source-map",

  resolve: {
    alias: {
      '~components': path.resolve(__dirname, '../src/components'),
      '~pages': path.resolve(__dirname, '../src/pages'),
      '~api': path.resolve(__dirname, '../src/api/'),
    },
    extensions: ['.js'],
  },
}