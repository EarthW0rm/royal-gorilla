const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const buildConfig = require('./build.config').GetInstance();
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function(env){
    var config = {
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
        , optimization: {
            splitChunks: {
                chunks: 'all'
            }
            , removeAvailableModules: true
        }
        , resolve:{
            extensions: ['.js', '.jsx', '.scss', '.css', '.html', 'jpg']
            , alias: buildConfig.Build.AliasesResolvers
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
                                presets: [['@babel/preset-env', { "targets": { "browsers": ["last 2 versions", "ie >= 11"] } }]
                                , '@babel/preset-react']
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
                                sourceMap: buildConfig.IsDevelopment()
                            }
                        }, {
                            loader: "sass-loader", options: {
                                sourceMap: buildConfig.IsDevelopment()
                            }
                        }]
                }            
                ,{
                    test: /\.woff|.woff2|.ttf|.eot*.*$/
                    , use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: 'assets/[hash]-[name].[ext]'
                            }
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
                    test: /\.(svg|gif|png|jp(e*)g)$/,  
                    use: [{
                        loader: 'url-loader',
                        options: { 
                            limit: 8000,
                            name: 'images/[hash]-[name].[ext]'
                        } 
                    }]
                }
            ]
        }
        , plugins: [
            new ExtractTextPlugin({
                filename: buildConfig.Build.OutputCss.filename
                , allChunks: true
            })
            , new UglifyJSPlugin({
                test: /\.js($|\?)/i
                , sourceMap: buildConfig.IsDevelopment()
            })            
        ]
    }

    if(buildConfig.IsDevelopment()){
        config.devtool = 'eval-source-map';
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    } else {
        config.plugins.push(new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: {
                discardComments: {
                  removeAll: true,
                },
              },
            canPrint: false,
        }));
    }

    config.plugins.push(new HtmlWebpackPlugin(buildConfig.Build.PugPlugin));
    
    config.plugins.push(new HtmlWebpackPugPlugin());

    config.plugins.push(new webpack.DefinePlugin({
        'NODE_ENV': process.env.NODE_ENV
    }));
    
    return config;
};