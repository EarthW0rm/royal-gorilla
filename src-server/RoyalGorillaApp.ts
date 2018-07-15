import express = require('express');
import path = require('path');
import RoyalGorillaServer from './server/RoyalGorillaServer';
import { RG_API_PORT, RG_NODE_ENV } from './common/Constants';
import ErrorHandler from './server/middlewares/ErrorHandler';

const RoyalGorillaApp = express();

RoyalGorillaApp.set('port', RG_API_PORT);
RoyalGorillaApp.set('env', RG_NODE_ENV);
RoyalGorillaApp.set('views', path.join(__dirname, 'views'));
RoyalGorillaApp.set('view engine', 'pug');

// view engine setup
RoyalGorillaApp.use(express.static(path.join(__dirname, 'public')));

//route setup.
import routesInitializer from './routes/_Initializer';
RoyalGorillaApp.use('/', routesInitializer);

RoyalGorillaApp.use(ErrorHandler.Handle_404);
RoyalGorillaApp.use(ErrorHandler.Handle_500);

RoyalGorillaServer(RoyalGorillaApp);

export default RoyalGorillaApp;


