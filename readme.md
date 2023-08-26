```powershell
npm init -y
npm i --save-dev webpack webpack-cli

@("fonts", "images", "scripts", "sass") | %{mkdir src/$_}

echo "const path = require('path');

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
};">webpack.config.js

npm i --save-dev sass sass-loader postcss-loader css-loader
npm i --save-dev autoprefixer cssnano
echo "module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano'),
        // More postCSS modules here if needed
    ]
}">postcss.config.js

echo "import `"../sass/style.scss`";">src/scripts/index.js
ni src/sass/style.scss
npm i --save-dev mini-css-extract-plugin

echo "<!DOCTYPE html>
<html>
  <head>
    <meta charset=`"utf-8`" />
    <title>Karo Kloud</title>
    <link rel=`"stylesheet`" href=`"dist/bundle.css`">
    <script src=`"dist/bundle.js`"></script>
  </head>
  <body>
  </body>
</html>">index.html
```

## webpack config
```js
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            // 4. gets all transformed CSS and extracts it into separate single bundled file
            loader: MiniCssExtractPlugin.loader
          },
          {
            // 3. resolves url() and @imports inside CSS
            loader: "css-loader",
          },
          {
            // 2. apply postCSS fixes like autoprefixer and minifying
            loader: "postcss-loader"
          },
          {
            // 1. transform SASS to standard CSS
            loader: "sass-loader",
            options: {
              implementation: require("sass")
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    })
  ]
};
```


## gitignore
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
