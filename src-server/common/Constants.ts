import * as dotenv from 'dotenv';
import { ENVIROMENTS } from './Enumerators';
export const RG_NODE_ENV = process.env.NODE_ENV || 'development';

export const RG_ENVIROMENT: ENVIROMENTS = (() => {
    switch (RG_NODE_ENV) {
        case  'development':
            return ENVIROMENTS.Development;
        case  'staging':
            return ENVIROMENTS.Staging;
        case  'production':
            return ENVIROMENTS.Production;
        case  'beta':
            return ENVIROMENTS.Beta;
        default:
            return ENVIROMENTS.Development;
    }
})();

dotenv.load();

export const RG_API_PORT = process.env.PORT || 3000;
export const RG_ROUTE_START_PATH = '';
export const RG_ROUTE_CLASS_IDENTIFIER = 'Route';
export const RG_DB_NAME = process.env.DB_NAME;
export const RG_DB_USER = process.env.DB_USER;
export const RG_DB_PASS = process.env.DB_PASS;
export const RG_DB_HOST = process.env.DB_HOST;
export const RG_DB_PORT = process.env.DB_PORT;
