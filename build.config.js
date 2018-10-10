const jsonfile = require('jsonfile');
const easter = require('./gulp/rg-gulp-easter');
const log = easter.MessageHelper;

class BuildConfig {


    static GetInstance(){
        if(!BuildConfig.instance)
            BuildConfig.instance = new BuildConfig();
        return BuildConfig.instance;
    }

    constructor() {
        require('dotenv').config();

        this.Host = 'localhost';
        this.NodeEnv = process.env.NODE_ENV.trim();
        this.Modes = ['development', 'staging', 'beta', 'production']

        if(!this.ModeIsValid()){
            throw new Error(`Mode inválido NODE_ENV: ${this.NodeEnv}`);
        } else {
            if(this.IsDevelopment()){
                easter.Logo();
                log.title('\\m/');
            }
            log.title(`Mode NODE_ENV: ${this.NodeEnv}`);
        }       
        
        this.Server = {
            Typescript: {
                tsconfig: './src-server/tsconfig.json',
                include: []
            },
            NodePort: process.env.PORT ? parseInt(process.env.PORT) : 3000
        }
        this.Server.Typescript.include = jsonfile.readFileSync(this.Server.Typescript.tsconfig).include;

        this.Build = {
            root_path: './build'
            , start_script: './build/RoyalGorillaApp.js'
            , Mode:  this.IsDevelopment() ? this.Modes[0] : this.Modes[3]
        }

        this.DevServer = {
            NodeWatch: ['./build/*.js','./build/**/*.js'],
            NodeAttachDebug: process.env.DEV_ATTACH && process.env.DEV_ATTACH=="true" ? true : false
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

module.exports = BuildConfig;