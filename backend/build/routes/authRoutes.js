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
const Sequelize = require('sequelize');
const router = require('express').Router();
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');
// Controllers
const AuthController = require('../controllers/AuthController');
// Models 
const { User, ExamCohort } = require('../models');
/**
 * Routes
 *
 * prefix: api/auth/
 */
// Google OAuth
router.post('/oauth/google', (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { code } = request.body;
        const token = yield new AuthController().signIn(code);
        return response.status(200).send(middleware.generateApiOutput("OK", { token }));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
module.exports = router;
