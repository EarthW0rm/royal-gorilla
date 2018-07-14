import * as core from "express-serve-static-core";
import express = require('express');

import RoyalRouter from "../common/RoyalRouter";
import { HTTP_METHODS } from "../common/Enumerators";

export default class IndexRoute extends RoyalRouter {
    constructor(_Router: core.Router){
        super(_Router);
        super.RegisterRoute( HTTP_METHODS.GET, '/', this.getHomePage);
        super.RegisterRoute( HTTP_METHODS.GET, '/info', this.getBasicInfo);
    }
    
    getHomePage(req: express.Request, res: express.Response) {
        res.render('index', { title: 'Express' });
    }

    getBasicInfo(req: express.Request, res: express.Response) {
        res.send("getBasicInfo: no resource");
    }
}