// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const router = require('express').Router();
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');
// Controllers
const Main = require('../controllers/main');
/**
 * Routes
 *
 * prefix: /
 */
// Read
router.get('/', (request, response) => __awaiter(this, void 0, void 0, function* () {
    const mainInstance = new Main("Welcome to exam cohort app!");
    response.send(middleware.generateApiOutput("OK", mainInstance.getMessage()));
}));
module.exports = router;
