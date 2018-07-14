import express = require('express');
import path = require('path');
import routes from './routes/index';
import RoyalGorillaServer from './RoyalGorillaServer';
import { RG_API_PORT } from './common/Constants';

const RoyalGorillaApp = express();

// view engine setup
RoyalGorillaApp.set('views', path.join(__dirname, 'views'));
RoyalGorillaApp.set('view engine', 'pug');
RoyalGorillaApp.use(express.static(path.join(__dirname, 'public')));
RoyalGorillaApp.use('/', routes);

// catch 404 and forward to error handler
RoyalGorillaApp.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (RoyalGorillaApp.get('env') === 'development') {
    RoyalGorillaApp.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
RoyalGorillaApp.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

RoyalGorillaApp.set('port', RG_API_PORT);
RoyalGorillaServer(RoyalGorillaApp);

export default RoyalGorillaApp;


