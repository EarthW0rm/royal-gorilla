import * as express from 'express';
import * as path from 'path';
import * as jsend from 'jsend';
import * as bodyParser from 'body-parser';

import RoyalGorillaServer from './server/RoyalGorillaServer';
import { RG_API_PORT, RG_NODE_ENV } from './common/Constants';
import ErrorHandler from './server/middlewares/ErrorHandler';
import routesInitializer from './routes/_Initializer';

const royalGorillaApp = express();

if (RG_NODE_ENV == 'development') {
    royalGorillaApp.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
}

royalGorillaApp.use(bodyParser.json());
royalGorillaApp.use(bodyParser.urlencoded({ extended: true }));
royalGorillaApp.use(jsend.middleware);
royalGorillaApp.set('port', RG_API_PORT);
royalGorillaApp.set('env', RG_NODE_ENV);

// route setup.
routesInitializer.then(routesIncialized => {
    royalGorillaApp.use('/', routesIncialized);
    royalGorillaApp.use(ErrorHandler.Handle_404);
    royalGorillaApp.use(ErrorHandler.Handle_500);
    RoyalGorillaServer(royalGorillaApp);
});

export default royalGorillaApp;
