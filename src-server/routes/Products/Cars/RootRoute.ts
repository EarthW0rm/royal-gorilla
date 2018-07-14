import * as core from "express-serve-static-core";
import express = require('express');

import RoyalRouter from "../../../common/RoyalRouter";
import { HTTP_METHODS } from "../../../common/Enumerators";

export default class RootRoute extends RoyalRouter {
    constructor(_Router: core.Router, _BasePath : string){
        super(_Router, _BasePath);
        super.RegisterRoute( HTTP_METHODS.GET, '/', this.getHomePage);
    }

    getHomePage(req: express.Request, res: express.Response) {
        res.render('index', { title: 'Cars Home Page' });
    }
}