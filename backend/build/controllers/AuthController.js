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
// Core Packages
const config = require('../utils/config');
const axios = require('axios');
const jwt = require('jsonwebtoken');
// Models
const Models = require('../models');
// Other Controllers
const UserController = require('./UserController');
// OAuth Helpers
const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.OAUTH_GOOGLE_CLIENT_ID, process.env.OAUTH_GOOGLE_CLIENT_SECRET, 'postmessage');
class AuthController {
    getGoogleUserDataFromCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokens } = yield oAuth2Client.getToken(code);
            const { data } = yield axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
            return data;
        });
    }
    generateTokenForUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDetails = yield Models.User.findOne({ where: { emailID: data.email } });
            const detailsForToken = { userID: userDetails.userID, emailID: userDetails.emailID, firstName: userDetails.firstName, lastName: userDetails.lastName, picture: data.picture };
            const token = jwt.sign(detailsForToken, config.SECRET, { expiresIn: '1h' });
            return token;
        });
    }
    signIn(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getGoogleUserDataFromCode(code);
            if (!(yield UserController.checkIfUserExists(data.email)))
                yield Models.User.create({ firstName: data.given_name, lastName: data.family_name, emailID: data.email });
            const token = yield this.generateTokenForUser(data);
            return token;
        });
    }
}
module.exports = AuthController;
