const gulp = require('gulp');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');
const log = require('./rg-gulp-easter').MessageHelper;

const scrScripts = ['./lib/**/*.js'];
const srcDestination = 'public/assets/js';


const taskExecucion = (done) => {

    let tsBuild = tsProject.src();

    if(process.env.NODE_ENV != 'production'){
        tsBuild = tsBuild.pipe(sourcemaps.init());
    }
    tsBuild = tsBuild.pipe(tsProject());
    if(process.env.NODE_ENV != 'production'){
        tsBuild = tsBuild.pipe(sourcemaps.write('.'));
    }
    tsBuild = tsBuild.pipe(gulp.dest("./build"));
    tsBuild.on('end', () => { 
        done();
    });
}

module.exports.Task = (done) => {
    taskExecucion(done);
}