import * as core from "express-serve-static-core";
import express = require('express');

import { RoyalG } from "../common/RoyalG";
import { HTTP_METHODS } from "../common/Enumerators";

function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}

export default class RootRoute extends RoyalG.Routing.RoyalRouter {
    constructor(_Router: core.Router, _BasePath : string){
        super(_Router, _BasePath);
        super.RegisterRoute( HTTP_METHODS.GET, '/', this.getHomePage);
    }

    getHomePage(req: express.Request, res: express.Response) {
        res.render('index', { title: 'Say hello to my little friend!' });
    }
}