const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack")

module.exports = {
  entry: "./src/frontend/index.js",
  output: {
    path: path.resolve(__dirname, "../../dist"),
    filename: "[name].[contenthash].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js"],
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        exclude: /node_module/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: 'assets/icon/[name].[ext]',
            },
          }
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_module/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css",
    }),
    new CleanWebpackPlugin(),
    // new Dotenv({
    //   path: './.env',
    //   safe: true,
    // })
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
};
