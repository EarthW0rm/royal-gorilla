/*
 * GET home page.
 */

import express = require('express');
const router = express.Router();

import IndexRoute from "./IndexRoute";

var iRoute = new IndexRoute(router);

export default router;