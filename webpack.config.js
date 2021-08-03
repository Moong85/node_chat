const HtmlWebpackPlugin = require("html-webpack-plugin");
const childProcess = require("child_process");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main: "./src/js/clientManager.js",
    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].js?[hash]",
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // 운영에서는 MiniCssExtractPlugin에 Loader 사용
                    process.env.NODE_ENV === "production"
                        ? MiniCssExtractPlugin.loader
                        // 개발서버 및 로컬에서는 style,css,sass Loader 사용
                        : "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                ]
            }
        ]
    },

    plugins: [
        // new webpack.BannerPlugin({
        //     banner: `
        //         Build Date: ${ new Date().toLocaleDateString() }
        //         Commit Version: ${ childProcess.execSync("git rev-parse --short HEAD") }
        //     `
        //     // Author: ${ childProcess.execSync("git config user.name") }
        // }),
        new webpack.DefinePlugin({
            // CONTEXT_PATH: process.env.NODE_ENV === "development" ?
            //     JSON.stringify("http://dev.unimewo.com:6780") :
            //     JSON.stringify("https://gooodcare.com")
            // DF_IP_DEV: JSON.stringify("127.0.0.1"),
            // DF_IP_PRD: JSON.stringify("127.0.0.1"),
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
            templateParameters: {
                env: process.env.NODE_ENV === "development" ? "(개발용)" : ""
            },
            favicon: "./favicon.ico"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        ...(
            process.env.NODE_ENV === "production"
                ? [ new MiniCssExtractPlugin({ // 운영만 css 별도 압축
                    filename: "[name].css"
                }) ]
                : []
        )
    ]
}