const pm2 = require('pm2');
const nodemon = require('gulp-nodemon');
const log = require('./rg-gulp-easter').MessageHelper;


module.exports = (done) => {
    if(process.env.NODE_ENV == 'production') {
        pm2.connect(function(err) {
            if (err) {
              console.error(err);
              process.exit(2);
            }
            
            pm2.start({
                name : 'royal-gorilla',
                script:'./build/RoyalGorillaApp.js'
            }, function(err, apps) {
                log.title('PM2 Started');
                done();
                process.exit(0);
            });
        });
    }
    else {
        if(process.env.NODE_ENV == 'development') {
            require('./rg-gulp-easter').Rule();
        }

        var stream = nodemon({ 
            nodemon: require('nodemon'),
            script: './build/RoyalGorillaApp.js',
            watch: ['src-server\\*.ts', 'src-server\\**\\*.ts'],
            tasks: ['typescript-compile']
        })
 
        stream
            .on('start', () => {
                log.title('NODEMON Started');
                done();
            })
            .on('restart', function () {
                log.warn('NODEMON Restarted');
            })
            .on('crash', function() {
                log.error('Application has crashed!\n');
                stream.emit('restart', 3);
            })
            .on('exit',() => {
                log.lightInfo('NODEMON Exited!');
            });
    }
}