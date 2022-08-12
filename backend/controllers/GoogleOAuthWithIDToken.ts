import { OAuthService, OAuthUserData } from './interfaces/OAuthService'

// Core Packages
const config = require('../utils/config')
const axios = require('axios')
const jwt = require('jsonwebtoken')

// Constants 
const OAUTH_GOOGLE_CLIENT_ID_WEB = process.env.OAUTH_GOOGLE_CLIENT_ID
const OAUTH_GOOGLE_CLIENT_ID_ANDROID = process.env.OAUTH_GOOGLE_CLIENT_ID_ANDROID

// OAuth Helpers
const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(
  OAUTH_GOOGLE_CLIENT_ID_WEB
);

// Controllers
const DatabaseController = require('./DatabaseController')

export class GoogleOAuthWithIDToken implements OAuthService {
  constructor() { }
  async getUserDataFromCallback(callback): Promise<OAuthUserData> {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: callback.idToken
    });
    const payload = ticket.getPayload();
    return {
      firstName: payload["given_name"],
      lastName: payload["family_name"],
      emailID: payload["email"],
      picture: payload["picture"]
    }
  };

  async generateTokenFromData(userData: OAuthUserData): Promise<string> {
    const userDetails = await DatabaseController.getUserFromEmailID(userData.emailID)
    const detailsForToken = { userID: userDetails.userID, emailID: userDetails.emailID, firstName: userDetails.firstName, lastName: userDetails.lastName, picture: userData.picture }
    const token = jwt.sign(detailsForToken, config.SECRET, { expiresIn: '24h' });
    return token
  }
}