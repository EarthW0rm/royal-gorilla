import * as core from "express-serve-static-core";
import { HTTP_METHODS } from "./Enumerators";
import { RG_ROUTE_CLASS_IDENTIFIER , RG_ROUTE_START_PATH} from "./Constants";

export default abstract class RoyalRouter {
    protected CoreRouter: core.Router;
    protected BasePath: string;
    
    constructor(_CoreRouter: core.Router, _BasePath : string) {
        this.CoreRouter = _CoreRouter;
        this.BasePath = _BasePath;
        this.RegisterRoute = this.RegisterRoute.bind(this);
        this.TranslatePath = this.TranslatePath.bind(this);
    }

    protected RegisterRoute(action: HTTP_METHODS, path: string, method: core.RequestHandler) {
        const newPath = this.TranslatePath(path);

        switch(action){
            case HTTP_METHODS.GET:
            default:
                this.CoreRouter.get(newPath, method);
            break;
            case HTTP_METHODS.POST:
                this.CoreRouter.post(newPath, method);
            break;
            case HTTP_METHODS.DELETE:
                this.CoreRouter.delete(newPath, method);
            break;
        }
    }

    private TranslatePath(path: string) : string {
        const startPath : string = RG_ROUTE_START_PATH + this.BasePath;
        const classRouteKey : string = RG_ROUTE_CLASS_IDENTIFIER;
        
        const className : string = (<any>this).constructor.name;
        const noKeyName : string = className.toLowerCase()
            .replace(classRouteKey.toLowerCase(), "");

        let newPath = "";

        path = path == "/" ? "" : path;
        
        switch(noKeyName){
            case "index":
            case "root":
                if(path.startsWith("/"))
                    newPath = `${startPath}${path.substr(1)}`;
                else
                    newPath = `${startPath}${path}`;
                break;
            default:
                newPath = `${startPath}${noKeyName}${path}`;
                break;
        }

        return newPath.toLowerCase();
    }
}