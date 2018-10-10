import * as core from 'express-serve-static-core';
import * as express from 'express';
import { HTTP_METHODS } from '../common/Enumerators';
import { RoyalG } from '../common/RoyalG';

function configurable(value: boolean) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        descriptor.configurable = value;
    };
}

export default class RootRoute extends RoyalG.Routing.RoyalRouter {
    constructor(_Router: core.Router, _BasePath: string) {
        super(_Router, _BasePath);
        super.RegisterRoute( HTTP_METHODS.GET, '/', this.getHomePage);
    }

    public getHomePage(req: express.Request, res: express.Response, next: core.NextFunction) {
        res.jsend.success({ title: 'Say hello to my little friend!', page: 'RootRoute' });
    }

}
