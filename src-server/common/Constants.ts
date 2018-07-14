import {ENVIROMENTS} from "./Enumerators"

export const RG_NODE_ENV=process.env.NODE_ENV || "development";
export const RG_API_PORT=process.env.PORT || 3000;
export const RG_ROUTE_START_PATH="";
export const RG_ROUTE_CLASS_IDENTIFIER="Route";

export const RG_ENVIROMENT : ENVIROMENTS = (() =>{ 
    switch(RG_NODE_ENV){
        case  "development":
            return ENVIROMENTS.Development;
        case  "staging":
            return ENVIROMENTS.Staging;
        case  "production":
            return ENVIROMENTS.Production;
        case  "beta":
            return ENVIROMENTS.Beta;
        default:
            return ENVIROMENTS.Development;
    }
})();



