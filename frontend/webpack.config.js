const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


/**
 * This webpack configuration is created with the help of this article - https://amiladevin.medium.com/create-a-react-web-application-using-webpack-5-full-walkthrough-40291c1fd004
 */


module.exports = (env) => {
  const IS_PRODUCTION = !!env.production;
  const IS_DEV_MODE = !!env.development;
  const environment = IS_PRODUCTION ? 'production' : 'development';
  const staticPrefix = path.join(__dirname, '.');

  console.log(`
=============================================
Starting frontend (${environment}), please wait...`);

  if (!IS_PRODUCTION) {
    console.log("All environment variables:");
    console.log(env);
  }

  return {

    mode: environment,


    /**
     * Let’s inform webpack where our application’s entry point,
     * Our application’s entrance point is essentially where our application starts
     */
    entry: './src/index.tsx',

    /**
     * The name and location of our bundled file will be generated when we produce a production build.
     */
    output: {
      /** We want to put this bundle.js file in a subdirectory called dist after it’s finished. */
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
      /**
       * PublicPath specifies the virtual directory in web server from where bundled file, app. js is going to get served up from.
       * Keep in mind, the word server when using publicPath can be either webpack-dev-server or express server or other server that you can use with webpack.
       */
      publicPath: '/',

    },


    plugins: [
      /** bundled JavaScript file to be loaded into an HTML file */
      new HTMLWebpackPlugin({
        template: './index.html',
        favicon: './src/images/logo.svg'
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
          type: "asset/inline",
        },

        /**
         * Add .ts, .tsx typescript file formats support
         */
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },



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
      // Without this page will not load on reload for a subpath url
      historyApiFallback: true,
      proxy: {
        '/api': 'http://localhost:3001',
        changeOrigin: true,
      },
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@app': path.join(staticPrefix, 'src'),
      }
    },

    /**
     * Required when using 'source-map' in tsconfig
     */
    devtool: IS_DEV_MODE && 'eval-cheap-module-source-map',



    optimization: {

      /**
       * split the code into separate chunks that can be loaded independently
       */
      splitChunks: {
        chunks: 'all',
        // asset size limit: recommended size limit (244 KiB)
        maxInitialSize: 244 * 1000,
      },
    },



  };



};
