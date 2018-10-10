import { RoyalG } from '../common/RoyalG';
import * as path from 'path';

export default (async () => {
    const routerInit = new RoyalG.Routing.RoyalRouterInitializer();
    const routesDirectoryPath = path.join(__dirname);
    await routerInit.RouteRegisterFolder(routesDirectoryPath);

    return  routerInit.Router;
})();
