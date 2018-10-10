const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const buildConfigClass = require('../build.config');
require('dotenv').load();

module.exports = function(env) {

    console.log(JSON.stringify(buildConfigClass.GetInstance()));

    function getOutput(){
        var output = {
            path:  path.join(__dirname, '..', 'build/public')
            , filename: '[name].app.js'
        }

        return output;
    } 

    return {
        entry: {
            poly: '@babel/polyfill', 
            layout: './src-front/layout.jsx',
            index: './src-front/index.jsx'            
        }
        , output: getOutput()
        , mode: buildConfigClass.GetInstance().IsProduction() === true ? 'production' : 'development'
        , optimization: {
            splitChunks: {
                chunks: 'all'
            }
            , removeAvailableModules: true
        }
        ,devServer:{
            port: process.env.DEV_PORT || 8080
            , contentBase:  path.join(__dirname, '..', 'build/public')
            , proxy: {
                '/api': {
                  target: `http://${buildConfigClass.GetInstance().Host}:${buildConfigClass.GetInstance().Server.NodePort}`,
                  pathRewrite: {'^/api' : ''}
                }
            }
        }
        , resolve:{
            extensions: ['.js', '.jsx', '.scss', '.css', '.html', 'jpg']
            , alias: {
                "$modules": path.resolve(__dirname, '..', 'node_modules'),
                "$redux-store": path.resolve(__dirname, 'main/redux-store'),
                "$redux-actions": path.resolve(__dirname, 'main/redux-store/actions'),
                "$redux-reducers": path.resolve(__dirname, 'main/redux-store/reducers'),
                "$main": path.resolve(__dirname, 'main'),
                "$sass": path.resolve(__dirname, 'sass'),
            }
        }
        , module: {
            rules: [
                {
                    test: /\.(jsx|js)$/
                    , exclude: /(node_modules|bower_components)/
                    , use: [
                        {
                            loader: 'babel-loader'
                            , options: {
                                presets: [ ['@babel/preset-env', {
                                    "targets": {
                                       "browsers": ["last 2 versions", "ie >= 11"]
                                    }
                                 }], '@babel/preset-react']
                                , plugins: [require('@babel/plugin-proposal-object-rest-spread')]
                            }
                        }
                    ]
                }
                ,{
                    test: /\.css$/
                    , use: ExtractTextPlugin.extract({
                        use: [ 'css-loader']
                    })
                }
                ,{
                    test: /\.scss$/
                    , exclude: /(node_modules|bower_components)/
                    , use: ExtractTextPlugin.extract({
                        use: ['css-loader', 'sass-loader']
                    })
                }            
                ,{
                    test: /\.woff|.woff2|.ttf|.eot|.svg*.*$/
                    , use: [
                        {
                        loader: "file-loader",
                        }
                    ]
                }                
                ,{
                    test: /\.html$/
                    , exclude: /(node_modules|bower_components)/
                    , use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                    ]
                }
                ,{
                    test: /\.(gif|png|jp(e*)g)$/,  
                    use: [{
                        loader: 'url-loader',
                        options: { 
                            limit: 8000, // Convert images < 8kb to base64 strings
                            name: 'images/[hash]-[name].[ext]'
                        } 
                    }]
                }
            ]
        }
        , plugins: [
            new ExtractTextPlugin({
                filename: '[name].app.css'
                , allChunks: true
            })
            //, new FaviconsWebpackPlugin('favicon.png')
            , new HtmlWebPackPlugin({
                template: "./src-front/index.html",
                favicon: './src-front/favicon.ico',
                filename: "index.html"
            })
        ]
    }
};