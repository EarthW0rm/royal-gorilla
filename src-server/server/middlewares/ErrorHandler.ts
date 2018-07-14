import * as core from "express-serve-static-core";
import { RG_ENVIROMENT } from "../../common/Constants";
import { ENVIROMENTS } from "../../common/Enumerators";

export default abstract class ErrorHandler {

    static Handle_404(req : core.Request, res: core.Response , next : core.NextFunction) {
        var err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    }

    static Handle_500(err: any, req : core.Request, res: core.Response) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: RG_ENVIROMENT === ENVIROMENTS.Development ? err : {}
        });
    }

}