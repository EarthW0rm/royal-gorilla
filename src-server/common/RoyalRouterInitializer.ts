import * as core from "express-serve-static-core";
import express = require('express');
import path = require('path');
import recursive = require("recursive-readdir");
import RoyalRouter from "../common/RoyalRouter";
import { RG_ROUTE_CLASS_IDENTIFIER } from "../common/Constants";


export default class RoyalRouterInitializer {
    public Router: core.Router;
    protected Routes: RoyalRouter[] =  [];

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
