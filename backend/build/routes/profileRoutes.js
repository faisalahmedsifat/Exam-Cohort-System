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
const UserController = require('../controllers/UserController');
/**
 * Routes
 *
 * prefix: /api/profile/
 */
// Read
router.get('/', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        const userProfile = yield UserController.getUserProfileDetails(request.userID);
        return response.send(middleware.generateApiOutput("OK", userProfile));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
module.exports = router;
