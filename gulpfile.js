const buildConfigClass = require('./build.config')
    , gulp = require('gulp')
    , rename = require('gulp-rename')
    , path = require("path")
    , ts = require("gulp-typescript")
    , nodemon = require('nodemon')
    , easter = require('./gulp/rg-gulp-easter')
    , log = easter.MessageHelper
    , sourcemaps = require('gulp-sourcemaps')
    , del = require('del')
    , mocha = require('gulp-mocha')
    , webpack = require("webpack")
    , webpackConfig = require('./src-front/webpack.config')
    , webpackDevServer = require('webpack-dev-server');

require('dotenv').load();

let tsProject = null;
let hasWatch = false;
let isTestTask = false;

gulp.task('copy-config', (done) => {
    gulp.src([`config/env/${process.env.NODE_ENV}.env`])
        .pipe(rename('.env'))
        .pipe(gulp.dest('./'))
        .on('end', () => { 
            done();
            buildConfig = buildConfigClass.GetInstance();
        });
});

gulp.task('clean-build', (done) => {
    del([buildConfigClass.GetInstance().Build.root_path], {force:true}).then(paths => {
        done();
    });
});

gulp.task('typescript-compile', (done) => {
    if(!tsProject){
        tsProject = ts.createProject(buildConfigClass.GetInstance().Server.Typescript.tsconfig);
    }

    let tsBuild = tsProject.src();
    if(buildConfigClass.GetInstance().EnviromentNotIs('production')) {
        tsBuild = tsBuild.pipe(sourcemaps.init());
    }
    tsBuild = tsBuild.pipe(tsProject());
    if(buildConfigClass.GetInstance().EnviromentNotIs('production')){
        tsBuild = tsBuild.pipe(sourcemaps.mapSources(function(sourcePath, file) {
            var filePath = path.relative(file.dirname, path.join(__dirname, sourcePath)).substr(3);
            return filePath;
        }));
        tsBuild = tsBuild.pipe(sourcemaps.write( '.' ));
    }
    tsBuild = tsBuild.pipe(gulp.dest(buildConfigClass.GetInstance().Build.root_path));
    if(buildConfigClass.GetInstance().IsDevelopment() && !isTestTask) {
        if(!hasWatch){
            gulp.watch(buildConfigClass.GetInstance().Server.Typescript.include, gulp.series('typescript-compile'));
            hasWatch = true;
        }
    }
    tsBuild.on('end', () => { 
        done();
    });
});

gulp.task('server-developer', (done) => {
    
    var nodemonOptions = { 
        nodemon: require('nodemon'),
        script: buildConfigClass.GetInstance().Build.start_script,
        watch: false
    }

    if(buildConfigClass.GetInstance().IsDevelopment()) {
        easter.Rule();
        nodemonOptions.watch = buildConfigClass.GetInstance().DevServer.NodeWatch;
        if(buildConfigClass.GetInstance().DevServer.NodeAttachDebug) {
            nodemonOptions.exec = 'node --inspect-brk';
        }
    }

    var stream = nodemon(nodemonOptions);

    stream
        .on('start', () => {
            log.title('NODEMON Development Started');
            done();
        })
        .on('restart', function () {
            //log.warn('NODEMON Restarted'); 
        })
        .on('crash', function() {
            log.error('Application has crashed!\n');
            stream.emit('restart', 3);
        })
        .on('exit',() => {
            log.lightInfo('NODEMON Exited!');
        });    
});

gulp.task('mocha-test', function (done) {
    var testPipe = gulp.src('tests/**/*.spec.js')
    .pipe(mocha({reporter: 'spec'}))
    .once('end', () => {
        done();
    })
    return testPipe;
})

gulp.task('webpack', function(done) {
	webpack(webpackConfig(), function(err, stats) {
        if(err) throw err;
        console.log("[webpack]", stats.toString());
        done();
	});
});

gulp.task('webpack-dev-server', function(done) {
    
    var devConfig = webpackConfig();
    devConfig.devtool = 'eval';

    // Start a webpack-dev-server
    new webpackDevServer(webpack(devConfig), devConfig.devServer).listen(process.env.DEV_PORT, buildConfigClass.GetInstance().Host, function(err) {
        if(err) throw err;
        console.log('[webpack-dev-server]', `http://${buildConfigClass.GetInstance().Host}:${process.env.DEV_PORT}`);
    })
});

gulp.task('pre-build', gulp.series('copy-config', 'clean-build'));

gulp.task('build', gulp.series('pre-build', 'typescript-compile', 'webpack'));

gulp.task('test', gulp.series((done) => {
    isTestTask = true;
    done();
},'build', 'mocha-test'));

gulp.task('developer', gulp.series('build', (done) => {
    if(hasWatch){
        log.warn('As alteracoes nos arquivos .ts serao automaticamente compiladas. CTRL+C para finalizar.');
        done();
    }
}, 'server-developer', 'webpack-dev-server'));

gulp.task('default', gulp.series('build'));

