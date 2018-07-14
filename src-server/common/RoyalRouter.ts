import * as core from "express-serve-static-core";
import { HTTP_METHODS } from "./Enumerators";

export default abstract class RoyalRouter {
    protected Router: core.Router;
    constructor(_Router: core.Router) {
        this.RegisterRoute = this.RegisterRoute.bind(this);
        this.Router = _Router;
    }

    protected RegisterRoute(action: HTTP_METHODS, path: string, method: core.RequestHandler) {
        switch(action){
            case HTTP_METHODS.GET:
            default:
                this.Router.get(path, method);
            break;
            case HTTP_METHODS.POST:
                this.Router.post(path, method);
            break;
            case HTTP_METHODS.DELETE:
                this.Router.delete(path, method);
            break;
        }
    }
}