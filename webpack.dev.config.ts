import ESLintPlugin from "eslint-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import {
  EnvironmentPlugin,
  ProvidePlugin,
  Configuration as WebpackConfiguration,
} from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const envExtensionDetector = (envType: string, extensions: string[]) => [
  ...extensions.map((ext: string) => `.${envType}${ext}`),
  ...extensions,
];

const config: Configuration = {
  mode: "development",
  output: {
    publicPath: "/",
  },
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: envExtensionDetector(process.env.ENV_TYPE!, [
      ".js",
      ".jsx",
      ".css",
      ".ts",
      ".tsx",
    ]),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
    new ProvidePlugin({
      process: "process/browser",
    }),
    new EnvironmentPlugin(["TOKEN"]),
  ],
  devtool: "inline-source-map",
  devServer: {
    static: path.join(__dirname, "build"),
    historyApiFallback: true,
    port: process.env.PORT,
    open: true,
    hot: true,
    allowedHosts: "all",
  },
};

export default config;
