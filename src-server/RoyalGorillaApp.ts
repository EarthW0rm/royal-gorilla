import * as path from 'path';

import * as express from 'express';
const RoyalGorillaApp = express();

/* #region [MIDDLEWARES] */
import * as jsend from 'jsend';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
RoyalGorillaApp.use(bodyParser.urlencoded({ extended: true }))
RoyalGorillaApp.use(bodyParser.json())
RoyalGorillaApp.use(compression());
RoyalGorillaApp.use(jsend.middleware);
/* #endregion */

/* #region [EXPRESS GLOBAL AND CONSTS] */
import { RG_API_PORT, RG_NODE_ENV } from './common/Constants';
RoyalGorillaApp.set('port', RG_API_PORT);
RoyalGorillaApp.set('env', RG_NODE_ENV);
/* #endregion */

/* #region [VIEWS AND PUBLIC RESOURCES] */
RoyalGorillaApp.set('views', path.join(__dirname, 'views'));
RoyalGorillaApp.set('view engine', 'pug');
RoyalGorillaApp.use(express.static(path.join(__dirname, 'public')));
/* #endregion */

/* #region [INICIALIZACAO DAS ROTAS] */
import routesInitializer from './routes/_Initializer';
RoyalGorillaApp.use('/', routesInitializer);
/* #endregion */

/* #region [ERROR HANDLER] */
import ErrorHandler from './server/middlewares/ErrorHandler';
RoyalGorillaApp.use(ErrorHandler.Handle_404);
RoyalGorillaApp.use(ErrorHandler.Handle_500);
/* #endregion */

import RoyalGorillaServer from './server/RoyalGorillaServer';
RoyalGorillaServer(RoyalGorillaApp);

export default RoyalGorillaApp;


