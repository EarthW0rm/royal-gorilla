import express = require('express');
import RoyalRouterInitializer from "../common/RoyalRouterInitializer";
import path = require('path');

const routerInit = new RoyalRouterInitializer();

const routesDirectoryPath = path.join(__dirname);
routerInit.RouteRegisterFolder(routesDirectoryPath);

export default routerInit.Router;