const HtmlWebpackPlugin = require("html-webpack-plugin");
const childProcess = require("child_process");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const process = require("process");
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const ipGroup = {};

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            if (!ipGroup[name]) {
                ipGroup[name] = [];
            }
            ipGroup[name].push(net.address);
        }
    }
}

console.log("network IPs -> ", ipGroup, ipGroup[Object.keys(ipGroup)[0]][0]);

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
            SERVER_IP: process.env.NODE_ENV === "development" ?
                JSON.stringify(ipGroup[Object.keys(ipGroup)[0]][0]) :
                JSON.stringify("182.229.104.64"),
            SOCKET_PORT: "3000",
            WEB_PORT: "8080"
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