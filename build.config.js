const jsonfile = require('jsonfile');

class BuildConfig {
    constructor(){
        this.Host = 'localhost';
        this.NodeEnv = process.env.NODE_ENV.trim();
        this.Modes = ['development', 'staging', 'beta', 'production']
        this.Server = {
            Typescript: {
                tsconfig: './tsconfig.json',
                include: []
            },
            NodePort: process.env.PORT ? parseInt(process.env.PORT) : 4000,
            EntryPoint: ['./src-front/index.jsx']
        }
        this.Build = {
            root_path: './build'
            , start_script: './build/RoyalGorillaApp.js'
            , Mode:  this.IsDevelopment() ? this.Modes[0] : this.Modes[3]
            , Output: {
                path: __dirname + '/build/public'
                , filename: './app.js'
            }
        }
        this.DevServer = {
            NodeWatch: ['./build/*.js','./build/**/*.js'],
            NodeAttachDebug: process.env.DEV_ATTACH ? true : false,
            BrowserSyncPort: process.env.DEV_PORT ? parseInt(process.env.DEV_PORT) : 8080,
        }

        this.Server.Typescript.include = jsonfile.readFileSync(this.Server.Typescript.tsconfig).include;

        if(this.IsDevelopment()) {
            this.Server.EntryPoint = ['react-hot-loader/patch', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=true', './src-front/index.jsx'];

            this.Build.Output.publicPath = `http://${this.Host}:${this.DevServer.BrowserSyncPort}/`
        }
    }

    EnviromentIs(compareTo) {
        return this.NodeEnv == compareTo;
    }
    EnviromentNotIs(compareTo) {
        return this.NodeEnv != compareTo;
    }
    ModeIsValid() {
        return (this.NodeEnv && this.Modes.indexOf(this.NodeEnv) >= 0);
    }

    IsDevelopment() {
        return this.NodeEnv == this.Modes[0];
    }

    IsProduction() {
        return this.NodeEnv == this.Modes[3];
    }
}

module.exports = new BuildConfig();