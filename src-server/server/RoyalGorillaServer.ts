import * as core from "express-serve-static-core";


export default (_RoyalGorillaApp : core.Express) => {
    const RoyalGorillaServer = _RoyalGorillaApp.listen(_RoyalGorillaApp.get('port'), function () {
        console.log('Express server listening on port ' + RoyalGorillaServer.address().port);
    });

    return RoyalGorillaServer;
}