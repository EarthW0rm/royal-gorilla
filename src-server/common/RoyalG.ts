import * as core from 'express-serve-static-core';
import * as express from 'express';
import * as recursive from 'recursive-readdir';
import * as path from 'path';
import { HTTP_METHODS } from './Enumerators';
import { RG_ROUTE_CLASS_IDENTIFIER , RG_ROUTE_START_PATH } from './Constants';

export namespace RoyalG {

    export namespace Routing {

        export abstract class RoyalRouter {
            protected CoreRouter: core.Router;
            protected BasePath: string;

            constructor(_CoreRouter: core.Router, _BasePath: string) {
                this.CoreRouter = _CoreRouter;
                this.BasePath = _BasePath;
                this.RegisterRoute = this.RegisterRoute.bind(this);
                this.TranslatePath = this.TranslatePath.bind(this);
            }

            protected RegisterRoute(action: HTTP_METHODS, pathRoute: string, method: core.RequestHandler) {
                const newPath = this.TranslatePath(pathRoute);

                switch (action) {
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
                    case HTTP_METHODS.PATCH:
                        this.CoreRouter.patch(newPath, method);
                        break;
                    case HTTP_METHODS.PUT:
                        this.CoreRouter.put(newPath, method);
                        break;
                    case HTTP_METHODS.OPTIONS:
                        this.CoreRouter.options(newPath, method);
                        break;
                }
            }

            private TranslatePath(pathRoute: string): string {
                const startPath: string = RG_ROUTE_START_PATH + this.BasePath;
                const classRouteKey: string = RG_ROUTE_CLASS_IDENTIFIER;

                const className: string = (<any>this).constructor.name;
                const noKeyName: string = className.toLowerCase()
                    .replace(classRouteKey.toLowerCase(), '');

                let newPath = '';

                pathRoute = pathRoute == '/' ? '' : pathRoute;

                switch (noKeyName) {
                    case 'index':
                    case 'root':
                        if (pathRoute.startsWith('/')) {
                            newPath = `${startPath}${pathRoute.substr(1)}`;
                        } else if (pathRoute.startsWith(':')) {
                            const orinalPath = startPath.split('/').filter(s => s != '');
                            const copoundPath = pathRoute.split('/').filter(s => s != '');
                            orinalPath.splice(orinalPath.length - 1, 0, copoundPath[0]);
                            const originStrng = orinalPath.join('/');
                            copoundPath.shift();
                            const nextPaths = copoundPath.join('/');
                            newPath = `/${originStrng}/${nextPaths}`;
                        } else {
                            newPath = `${startPath}${pathRoute}`;
                        }
                        break;
                    default:
                        newPath = `${startPath}${noKeyName}${pathRoute}`;
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

            public RouteRegister<T extends RoyalRouter>(TCreator: { new (_Router, _BasePath): T; }, _BasePath: string) {
                this.Routes.push(new TCreator(this.Router, _BasePath));
            }

            public async RouteRegisterFolder(FolderPath: string): Promise<void> {
                const currentDirectory = __dirname;
                const relativeDirectory = path.relative(currentDirectory, FolderPath).split('\\').join('/');

                const filesList = await recursive(FolderPath);
                const listValidFiles: string[] = [];

                for (let i = 0; i < filesList.length; i++ ) {
                    const filePath: string  = filesList[i];
                    const fileSufix = `${RG_ROUTE_CLASS_IDENTIFIER}.js`;
                    const indexOf = filePath.lastIndexOf(fileSufix);
                    if (indexOf == filePath.length - fileSufix.length) {
                        const convertPath = path.relative(currentDirectory, filePath)
                            .replace('.js', '').split('\\').join('/');
                        listValidFiles.push(convertPath);
                    }
                }

                for (let index = 0; index < listValidFiles.length; index++) {
                    const pathFile = listValidFiles[index];
                    const routeImport = await import(pathFile);
                    const pathArray = pathFile.replace(relativeDirectory, '').split('/').filter(s => s != '');
                    if (pathArray.length == 1) {
                        this.RouteRegister<RoyalRouter>(routeImport.default, '/');
                    } else if (pathArray.length > 1) {
                        const routeStruct = pathArray.slice(0, pathArray.length - 1).join('/');
                        this.RouteRegister<RoyalRouter>(routeImport.default, `/${routeStruct}/`);
                    }
                }
            }
        }

    }

}
