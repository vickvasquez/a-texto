const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const generateScopedName = require('../src/lib/generatedScopedName');
const autoprefixer = require('autoprefixer');

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
        options: {
          cacheDirectory: true,
          plugins: [
            [
              'react-css-modules',
              {
                filetypes: {
                  '.scss': {
                    syntax: 'postcss-scss',
                  },
                },
                generateScopedName,
              },
            ],
          ],
        },
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
          getLocalIdent: (context, localIdentName, localName) =>
            generateScopedName(localName, context.resourcePath),
        }
      }, {
        loader: 'sass-loader?!css-loader',
        options: {
          outputStyle: 'expanded',
          data: '@import "variables";',
          import: true,
          includePaths: [path.resolve('./frontend/src/styles')],
        },
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: () => [
            autoprefixer,
          ],
        },
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
          pngquant: {
            quality: '65-90',
            speed: 4,
          },
          mozjpeg: {
            quality: 60,
          },
          bypassOnDebug: true,
        },
      }],
    }, {
      test: /\.gql$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    }]
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