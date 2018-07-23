import * as core from "express-serve-static-core";
import express = require('express');
import path = require('path');
import recursive = require("recursive-readdir");
import { HTTP_METHODS } from "./Enumerators";
import { RG_ROUTE_CLASS_IDENTIFIER , RG_ROUTE_START_PATH} from "./Constants";

export namespace RoyalG {

    export namespace Routing {

        export abstract class RoyalRouter {
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
                        if(path.startsWith("/")){
                            newPath = `${startPath}${path.substr(1)}`;
                        }
                        else if (path.startsWith(":")){
                            var orinalPath = startPath.split('/').filter(s => s != "");
                            var copoundPath = path.split('/').filter(s => s != "");
                            orinalPath.splice(orinalPath.length - 1, 0, copoundPath[0]);
                            var originStrng = orinalPath.join('/');
                            copoundPath.shift();
                            var nextPaths = copoundPath.join('/');
                            newPath = `/${originStrng}/${nextPaths}`;
                        }
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

        export class RoyalRouterInitializer {
            public Router: core.Router;
            protected Routes: RoyalRouter[] = [];
        
            constructor(_Router: core.Router = express.Router() ) {
                this.Router = _Router;
                this.RouteRegister = this.RouteRegister.bind(this);
                this.RouteRegisterFolder = this.RouteRegisterFolder.bind(this);
            }
        
            RouteRegister<T extends RoyalRouter>(TCreator: { new (_Router, _BasePath): T; }, _BasePath : string){
                this.Routes.push(new TCreator(this.Router, _BasePath));
            }
        
            async RouteRegisterFolder(FolderPath : string) : Promise<void>{
                const currentDirectory = __dirname;
                const relativeDirectory = path.relative(currentDirectory,FolderPath).split("\\").join("/");
        
                const filesList = await recursive(FolderPath);
                let listValidFiles : string[] = [];
        
                for(var i = 0; i < filesList.length; i++ ){
                    const filePath : string  = filesList[i]
                    const fileSufix = `${RG_ROUTE_CLASS_IDENTIFIER}.js`;
                    const indexOf = filePath.lastIndexOf(fileSufix);
                    if(indexOf == filePath.length - fileSufix.length){
                        let convertPath = path.relative(currentDirectory,filePath)
                            .replace(".js", "").split("\\").join("/");        
                        listValidFiles.push(convertPath);
                    }
                }
        
                for (let index = 0; index < listValidFiles.length; index++) {
                    const path = listValidFiles[index];
                    var routeImport = await import(path);
                    var pathArray = path.replace(relativeDirectory, "").split("/").filter(s => s != "");
                    if(pathArray.length == 1){
                        this.RouteRegister<RoyalRouter>(routeImport.default, "/");
                    } else if (pathArray.length > 1){
                        var routeStruct = pathArray.slice(0, pathArray.length - 1).join("/");
                        this.RouteRegister<RoyalRouter>(routeImport.default, `/${routeStruct}/`);
                    }
                }
            }
        }

    }
    
}