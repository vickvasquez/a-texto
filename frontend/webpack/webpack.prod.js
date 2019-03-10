const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const generateScopedName = require('./lib/generateScopedName')

const plugins = [
  new MiniCssExtractPlugin({
    filename: "css/[hash].css",
    chunkFilename: "[id].[hash].css",
  }),
  new CleanWebpackPlugin(['dist'], {
    root: __dirname,
    verbose: true
  }),
  new HtmlWebpackPlugin({
    template: path.resolve('./public/index.html'),
    inject: true,
    minify: {
      collapseWhitespace: true,
    },
    hash: true,
  })
]

module.exports = {
  context: path.join(__dirname, '../'),
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          },
          safe: true,
        }
      })
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
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
  resolve: {
    alias: {
      '~components': path.resolve(__dirname, '../src/components'),
      '~pages': path.resolve(__dirname, '../src/pages'),
    },
    extensions: ['.js'],
  },
}