import * as core from 'express-serve-static-core';
import { RG_ENVIROMENT } from '../../common/Constants';
import { ENVIROMENTS } from '../../common/Enumerators';
import { IncomingHttpHeaders } from 'http';
import { IErrorData, IResponseModel, EResponseStatus } from '../../models';

export const JSEND_MESSAGES = [''];

export class Error404Data {
    public url: string;
    public method: string;
    public protocol: string;
    public headers: IncomingHttpHeaders;

    constructor(_url: string, _method: string, _protocol: string, _headers: IncomingHttpHeaders) {
        this.url = _url;
        this.method = _method;
        this.protocol = _protocol;
        this.headers = _headers;
    }
}

export default abstract class ErrorHandler {

    public static Handle_404(req: core.Request, res: core.Response, next: core.NextFunction) {

        const errorInfo: Error404Data = new Error404Data(req.url, req.method, req.protocol, req.headers);
        const errorData: IErrorData<Error404Data> = {
            code: 404
            , message: 'Not Found'
            , data: errorInfo
        };

        const errorResponse: IResponseModel<IErrorData<Error404Data>> = {
            status: EResponseStatus.ERROR
            , data: errorData
        };

        res.status(404);
        res.send(errorResponse);
    }

    public static Handle_500(err: Error, req: core.Request, res: core.Response, next: core.NextFunction) {

        const errorData: IErrorData<any> = {
            code: 500
            , message: 'Internal Server Error'
            , data: RG_ENVIROMENT === ENVIROMENTS.Development ? {
                stack: err.stack
                , message: err.message
                , name: err.name
            } : {}
        };
        const errorResponse: IResponseModel<IErrorData<Error404Data>> = {
            status: EResponseStatus.ERROR
            , data: errorData
        };

        res.status(500);
        res.send(errorResponse);
    }
}
