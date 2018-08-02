import * as core from "express-serve-static-core";
import express = require('express');

import { RoyalG } from "../../common/RoyalG";
import { HTTP_METHODS } from "../../common/Enumerators";

import MotorcyclesRequestModel from './MotorcyclesModel';


export default class MotorcyclesRoute extends RoyalG.Routing.RoyalRouter {
    constructor(_Router: core.Router, _BasePath : string){
        super(_Router, _BasePath);
        super.RegisterRoute( HTTP_METHODS.GET, '/', this.getHomePage);
    }
    
    getHomePage(req: express.Request, res: express.Response) {
        debugger;

        let model = new MotorcyclesRequestModel(1, 'royal enfield', 1998);
        var err = model.Validate();



        

        res.render('index', { title: 'Motorcycles Home Page' });
    }
}