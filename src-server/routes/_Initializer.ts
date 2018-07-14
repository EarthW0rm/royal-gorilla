
import { RoyalG } from "../common/RoyalG";
import path = require('path');

export default (() => {
    const routerInit = new RoyalG.Routing.RoyalRouterInitializer();
    const routesDirectoryPath = path.join(__dirname);
    routerInit.RouteRegisterFolder(routesDirectoryPath);
    return  routerInit.Router;
})();