const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  console.log('Production: ', env.production);
  return {
    mode: env.production ? "production" : "development",
    entry: './src/scripts/index.ts',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            env.production ? MiniCssExtractPlugin.loader : "style-loader", // 4. gets all transformed CSS and extracts it into separate single bundled file
            "css-loader", // 3. resolves url() and @imports inside CSS
            "postcss-loader", // 2. apply postCSS fixes like autoprefixer and minifying
            "sass-loader", // 1. transform SASS to standard CSS
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[contenthash][ext][query]',
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[contenthash][ext][query]',
          }
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: '[name].bundle.[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].bundle.[contenthash].css"
      }),
      new HtmlWebpackPlugin({
        title: 'Karo Kloud',
      }),
    ],
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
}
