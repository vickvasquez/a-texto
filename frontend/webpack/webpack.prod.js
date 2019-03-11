const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const generateScopedName = require('../src/lib/generatedScopedName');
const autoprefixer = require('autoprefixer');

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
    template: path.resolve('./frontend/public/index.html'),
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
            removeAll: true,
          },
          safe: true,
        }
      })
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
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
            getLocalIdent: (context, localIdentName, localName) =>
              generateScopedName(localName, context.resourcePath),
          }
        }, {
          loader: 'sass-loader?!css-loader',
          options: {
            outputStyle: 'expanded',
            import: true,
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
      '~api': path.resolve(__dirname, '../src/api/'),
    },
    extensions: ['.js'],
  },
}