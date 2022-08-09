import {OAuthService, OAuthUserData} from './interfaces/OAuthService'

// SETTINGS
const AUTHORIZATION_CODES_MAXIMUM_LENGTH = 100;

// Core Packages
const config = require('../utils/config')
const axios = require('axios')
const jwt = require('jsonwebtoken')

// OAuth Helpers
const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(
  process.env.OAUTH_GOOGLE_CLIENT_ID,
  process.env.OAUTH_GOOGLE_CLIENT_SECRET,
  'postmessage',
);

// Controllers
const DatabaseController = require('./DatabaseController')

export class GoogleOAuth implements OAuthService{
  constructor(){}
  async getAccessTokenFromCallback(callback){
    if(callback.code.length >= AUTHORIZATION_CODES_MAXIMUM_LENGTH) return callback.code;
    else{
      const { tokens } = await oAuth2Client.getToken(callback.code);
      return tokens.access_token;
    }
  }
  async getUserDataFromCallback(callback): Promise<OAuthUserData>{
    const access_token = await this.getAccessTokenFromCallback(callback)
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${access_token}` } })
    return {
      firstName: data.given_name,
      lastName: data.family_name,
      emailID: data.email,
      picture: data.picture
    }
  };
  
  async generateTokenFromData(userData: OAuthUserData): Promise<string>{
    const userDetails = await DatabaseController.getUserFromEmailID(userData.emailID)
    const detailsForToken = { userID: userDetails.userID, emailID: userDetails.emailID, firstName: userDetails.firstName, lastName: userDetails.lastName, picture: userData.picture }
    const token = jwt.sign(detailsForToken, config.SECRET, { expiresIn: '24h' });
    return token
  }
}