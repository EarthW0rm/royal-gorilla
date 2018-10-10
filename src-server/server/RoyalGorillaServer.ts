import * as core from 'express-serve-static-core';

export default (_RoyalGorillaApp: core.Express) => {
    const RoyalGorillaServer = _RoyalGorillaApp.listen(_RoyalGorillaApp.get('port'), () => {
        console.log(`Express server listening on port: ${_RoyalGorillaApp.get('port')}`);
    });

    return RoyalGorillaServer;

};
