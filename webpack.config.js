const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = function() {

    return {
        entry: './src-front/index.jsx'
        , output:{
            path: __dirname + '/build/public'
            , filename: './app.js'
        }
        , devServer: {
            historyApiFallback: true,
            // hot: true,
            // inline: true,          
            host: 'localhost',
            port: 8080,
            open: true,
            openPage: '',
            progress: true,
            proxy: {
                '*': {
                    target: 'http://localhost:3000/',
                    secure: false
                }
            },
            stats: { colors: true },
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
                    test: /\.(png|jp(e*)g)$/,  
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
                filename: 'app.css'
                , allChunks: true
            })
            //, new FaviconsWebpackPlugin('favicon.png')
            // , new HtmlWebPackPlugin({
            //     template: "./src/index.html",
            //     favicon: 'src/AWESOM-O.ico',
            //     filename: "./index.html"
            // })
            // , new webpack.DefinePlugin({
            //     'process.env': {
            //         'API_URL': JSON.stringify(env.API_URL)
            //     }
            // })
        ]
    }
};