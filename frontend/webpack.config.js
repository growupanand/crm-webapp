const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


/**
 * This webpack configuration is created with the help of this article - https://amiladevin.medium.com/create-a-react-web-application-using-webpack-5-full-walkthrough-40291c1fd004
 */


module.exports = {
  /**
   * Let’s inform webpack where our application’s entry point,
   * Our application’s entrance point is essentially where our application starts
   */
  entry: './src/index.js',

  /**
   * The name and location of our bundled file will be generated when we produce a production build.
   */
  output: {
    /** We want to put this bundle.js file in a subdirectory called dist after it’s finished. */
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
    /**
     * PublicPath specifies the virtual directory in web server from where bundled file, app. js is going to get served up from.
     * Keep in mind, the word server when using publicPath can be either webpack-dev-server or express server or other server that you can use with webpack.
     */
    publicPath: '/',
  },


  plugins: [
    /** bundled JavaScript file to be loaded into an HTML file */
    new HTMLWebpackPlugin({
      template: './src/index.html',
      favicon: './src/logo.svg'
    }),

    // bundle all css files into one single css file
    new MiniCssExtractPlugin()
  ],

  module: {
    /**
    * How various sorts of modules in our project are processed is determined by what we give into this module object.
    * The rules key is then used to provide the module’s creation rules.
    */
    rules: [
      /**
       * First of all, we can create a rule here that we are going to use Babel to transpile all files that end in .js or .jsx excluding files located in the node_modules directory.
       */
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: "defaults" }], ['@babel/preset-react', { runtime: "automatic" }]]
          }
        }
      },

      /**
       * Add Some .css, .scss Formats Supports
       */
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: { publicPath: "" },
        },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },


      /**
       * Add images file Formats support
       */
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
      }
    ],
  },

  devServer: {
    /**
     * add hot module replacement (HMR) to our development environment.
     * HMR exchanges, adds or removes modules while the application is running without requiring a full reload,
     * making our development environment more efficient
     */
    hot: true,
    port: 3000,
    open: true,
  },

}
