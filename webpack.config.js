const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
    module: {
        rules: [{
            test: /\.html$/,
            include: path.join(__dirname, 'src/components'),
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: true,
                    interpolate: true
                }
            },
            ],
        },
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader'
            ]
        },
        {
            test: /\.(png|jpg|gif|svg|ttf|TTF)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash].[ext]',
                        outputPath: 'assets/'
                    }
                }
            ]
        },
        {
            test: /\.php$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '/'
                    }
                }
            ]
        }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    }
};
