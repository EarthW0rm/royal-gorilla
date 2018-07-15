const modes = ['development', 'staging', 'production', 'beta'];
const gulp = require('gulp');
const rename = require('gulp-rename');
const path = require("path");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("./tsconfig.json");
const pm2 = require('pm2');
const nodemon = require('gulp-nodemon');
const easter = require('./gulp/rg-gulp-easter');
const log = easter.MessageHelper;
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const gutil = require("gulp-util");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const exec = require('gulp-exec');

const appBuildFolder = './build';
const appStartFile = `${appBuildFolder}/RoyalGorillaApp.js`
let webpackConfig = require('./webpack.config')();

const browserSync = require('browser-sync').create();

process.env.NODE_ENV="development"

if(!process.env.NODE_ENV || modes.indexOf(process.env.NODE_ENV.trim()) < 0){
    throw new Error(`Mode inválido NODE_ENV: ${process.env.NODE_ENV}`);
} else {
    if(process.env.NODE_ENV == 'development'){
        easter.Logo();
        log.title('\\m/');
    }
    log.title(`Mode NODE_ENV: ${process.env.NODE_ENV}`);
}


gulp.task('clean-build', (done) => {
    del([`${appBuildFolder}`], {force:true}).then(paths => {
        done();
    });
});

gulp.task('copy-views', (done) => {
    gulp.src([`src-server/views/**/*.pug`])
        .pipe(gulp.dest(`${appBuildFolder}/views`))
        .on('end', () => { 
            done();
        });
});

gulp.task('copy-config', (done) => {
    gulp.src([`config/env/${process.env.NODE_ENV}.env`])
        .pipe(rename('.env'))
        .pipe(gulp.dest('./'))
        .on('end', () => { 
            done();
        });
});

gulp.task('typescript-compile', (done) => {

    let tsBuild = tsProject.src();

    if(process.env.NODE_ENV != 'production'){
        tsBuild = tsBuild.pipe(sourcemaps.init());
    }
    tsBuild = tsBuild.pipe(tsProject());
    if(process.env.NODE_ENV != 'production'){

        tsBuild = tsBuild.pipe(sourcemaps.mapSources(function(sourcePath, file) {
            var filePath = path.relative(file.dirname, path.join(__dirname, sourcePath)).substr(3);
            return filePath;
        }));

        tsBuild = tsBuild.pipe(sourcemaps.write( '.' ));
    }
    tsBuild = tsBuild.pipe(gulp.dest(appBuildFolder));
    tsBuild.on('end', () => { 
        done();
    });
});

gulp.task('server-pm2', (done) => {
    if(process.env.NODE_ENV == 'production') {
        pm2.connect(function(err) {
            if (err) {
              console.error(err);
              process.exit(2);
            }
            
            pm2.start({
                name : 'royal-gorilla',
                script: appStartFile
            }, function(err, apps) {
                log.title('PM2 Started');
                done();
                process.exit(0);
            });
        });
    }
    else {
        var nodemonOptions = { 
            nodemon: require('nodemon'),
            script: appStartFile,
            watch: [`${appBuildFolder}/*.js`]
        }

        if(process.env.NODE_ENV == 'development') {
            easter.Rule();
            //nodemonOptions.exec = 'node --inspect-brk';
        }

        var stream = nodemon(nodemonOptions);
 
        stream
            .on('start', () => {
                log.title('NODEMON Started');
                done();
            })
            .on('restart', function () {
                log.warn('NODEMON Restarted');
                browserSync.BrowserSync.reload();
            })
            .on('crash', function() {
                log.error('Application has crashed!\n');
                stream.emit('restart', 3);
            })
            .on('exit',() => {
                log.lightInfo('NODEMON Exited!');
            });
    }
});

gulp.task('webpack', function(done) {
	webpack( webpackConfig, function(err, stats) {
        if(err) throw err;
		gutil.log("[webpack]", stats.toString());
		done();
	});
});
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

gulp.task('webpack-dev-server', function(done) {

    var bundler = webpack(webpackConfig);
    var browserSyncConfig = {
        port: webpackConfig.devServer.port,
        proxy: webpackConfig.devServer.proxy,

        files: [
          '*.css',
          '*.scss'
        ]
    };
    browserSyncConfig.proxy.middleware = [
        webpackDevMiddleware(bundler, {
          publicPath: webpackConfig.output.publicPath,
          stats: { colors: true },
          hot: true
        }),
        webpackHotMiddleware(bundler, {
            publicPath: webpackConfig.output.publicPath,
            hot: true})
    ];

    browserSync.init(browserSyncConfig);
});

gulp.task('build', gulp.series('clean-build', 'copy-config', gulp.parallel('copy-views', 'typescript-compile', 'webpack')), (done) => {
    log.warn('Task completed: build');
    done();
});

gulp.task('super', gulp.series('build', 'server-pm2'), (done) => {
    log.warn('Task completed: super');
    done();
});

gulp.task('super-dev-server', gulp.series('build', gulp.parallel('server-pm2','webpack-dev-server')), (done) => {
    log.warn('Task completed: super-dev-server');
    done();
});