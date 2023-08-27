```powershell
npm init -y
npm i --save-dev webpack webpack-cli
ni webpack.config.js
@("fonts", "images", "scripts", "sass") | %{mkdir src/$_}

npm i --save-dev sass sass-loader postcss-loader style-loader css-loader
npm i --save-dev autoprefixer cssnano
npm i --save-dev mini-css-extract-plugin html-webpack-plugin
ni postcss.config.js
ni src/sass/style.scss

npm install --save-dev typescript ts-loader
ni tsconfig.json
echo "import `"../sass/style.scss`";">src/scripts/index.ts
npm install --save-dev webpack-dev-server
```

## webpack.config.js
```js
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
```
## .gitignore
```
# VSCode specific files and directories
.vscode/

# npm related files and directories
node_modules/
npm-debug.log
package-lock.json

# webpack related files and directories
dist/
build/
.webpack/
.cache/
```
## teconfig.json
```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "allowJs": true,
    "moduleResolution": "node",
    "sourceMap": false,
    "alwaysStrict": true
  }
}
```
## postcss.config.js
```js
module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano'),
        // More postCSS modules here if needed
    ]
}
```
