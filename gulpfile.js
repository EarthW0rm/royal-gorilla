process.env.NODE_ENV="development"
const buildConfigClass = require('./build.config');
let buildConfig  = null;
let webpackConfig = null;

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
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const browserSync = require('browser-sync').create();

gulp.task('copy-config', (done) => {
    gulp.src([`config/env/${process.env.NODE_ENV}.env`])
        .pipe(rename('.env'))
        .pipe(gulp.dest('./'))
        .on('end', () => { 
            done();
            buildConfig = buildConfigClass.GetInstance();
            webpackConfig = require('./webpack.config')();
        });
});


gulp.task('clean-build', (done) => {
    del([buildConfig.Build.root_path], {force:true}).then(paths => {
        done();
    });
});

gulp.task('copy-views', (done) => {
    gulp.src([`src-server/views/**/*.pug`])
        .pipe(gulp.dest(`${buildConfig.Build.root_path}/views`))
        .on('end', () => { 
            done();
        });
});

gulp.task('typescript-compile', (done) => {
    let tsBuild = tsProject.src();
    if(buildConfig.EnviromentNotIs('production')){
        tsBuild = tsBuild.pipe(sourcemaps.init());
    }
    tsBuild = tsBuild.pipe(tsProject());
    if(buildConfig.EnviromentNotIs('production')){
        tsBuild = tsBuild.pipe(sourcemaps.mapSources(function(sourcePath, file) {
            var filePath = path.relative(file.dirname, path.join(__dirname, sourcePath)).substr(3);
            return filePath;
        }));
        tsBuild = tsBuild.pipe(sourcemaps.write( '.' ));
    }
    tsBuild = tsBuild.pipe(gulp.dest(buildConfig.Build.root_path));
    if(buildConfig.IsDevelopment()) {
        gulp.watch(buildConfig.Server.Typescript.include, gulp.series('typescript-compile'));
    }
    tsBuild.on('end', () => { 
        done();
    });
});

gulp.task('server-pm2', (done) => {
    if(buildConfig.IsProduction()) {
        pm2.connect(function(err) {
            if (err) {
              console.error(err);
              process.exit(2);
            }
            
            pm2.start({
                name : 'royal-gorilla',
                script: buildConfig.Build.start_script
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
            script: buildConfig.Build.start_script,
            watch: false
        }

        if(buildConfig.IsDevelopment()) {
            easter.Rule();
            nodemonOptions.watch = buildConfig.DevServer.NodeWatch;
            if(buildConfig.DevServer.NodeAttachDebug) {
                nodemonOptions.exec = 'node --inspect-brk';
            }
        }

        var stream = nodemon(nodemonOptions);
 
        stream
            .on('start', () => {
                log.title('NODEMON Started');
                done();
            })
            .on('restart', function () {
                log.warn('NODEMON Restarted'); 
                if(buildConfig.IsDevelopment()) {
                    browserSync.reload();
                }
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
	webpack(webpackConfig, function(err, stats) {
        if(err) throw err;
        gutil.log("[webpack]", stats.toString());
        done();
	});
});

gulp.task('webpack-dev-server', function(done) {
    var bundler = webpack(webpackConfig);
    var browserSyncConfig = {
        port: webpackConfig.devServer.port,
        proxy: webpackConfig.devServer.proxy,
    };

    browserSyncConfig.proxy.middleware = [
        webpackDevMiddleware(bundler, {
          publicPath: webpackConfig.output.publicPath,
          stats: { colors: true },
          hot: true
        }),
        webpackHotMiddleware(bundler, { publicPath: webpackConfig.output.publicPath, hot: true })
    ];

    browserSync.init(browserSyncConfig);
});

gulp.task('pre-build', gulp.series('copy-config', 'clean-build', 'copy-views'), (done) => {
    log.warn('Task completed: pre-build');
    done();
});

gulp.task('build', gulp.series('pre-build', gulp.parallel('webpack', 'typescript-compile')), (done) => {
    log.warn('Task completed: build');
    done();
});

gulp.task('super', gulp.series('build', gulp.parallel('server-pm2', 'webpack-dev-server')),  (done) => {
    log.warn('Task completed: super-dev-server');
    done();
});

gulp.task('default', gulp.series('super'));