const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const buildConfig = require('./build.config');

module.exports = function(env){
    return {
        entry: buildConfig.Server.EntryPoint
        , mode: buildConfig.Build.Mode
        , output: buildConfig.Build.Output
        , devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,          
            host: buildConfig.Host,
            port: buildConfig.DevServer.BrowserSyncPort,
            open: true,
            openPage: '',
            progress: true,
            proxy: {
                target: `http://${buildConfig.Host}:${buildConfig.Server.NodePort}/`
            }
        }
        , devtool: 'eval-source-map'
        , resolve:{
            extensions: ['.js', '.jsx', '.scss', '.css', '.html', 'jpg']
            , alias: {
                modules: __dirname + '/node_modules'
            }
        }    
        , module: {
            rules: [
                {
                    test: /\.js[x]$/
                    , exclude: /(node_modules|bower_components)/
                    , use: [
                        {
                            loader: 'babel-loader'
                            , options: {
                                presets: ['@babel/preset-env', '@babel/preset-react']
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
                    , use: [{
                            loader: "style-loader"
                        }, {
                            loader: "css-loader", options: {
                                sourceMap: true
                            }
                        }, {
                            loader: "sass-loader", options: {
                                sourceMap: true
                            }
                        }]
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
                    test: /\.(png|jp(e*)g)$/,  
                    use: [{
                        loader: 'url-loader',
                        options: { 
                            limit: 16000,
                            name: 'images/[hash]-[name].[ext]'
                        } 
                    }]
                }
            ]
        }
        , plugins: [
            new ExtractTextPlugin({
                filename: 'app.css'
                , allChunks: true
            })
            , new webpack.HotModuleReplacementPlugin()
        ]
    }
};