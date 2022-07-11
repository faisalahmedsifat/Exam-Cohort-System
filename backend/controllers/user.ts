// @ts-nocheck

// Core Packages
const config = require('../utils/config')
const axios = require('axios')
const jwt = require('jsonwebtoken')

// Models
const Models = require('../models')

// OAuth Helpers
const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(
  process.env.OAUTH_GOOGLE_CLIENT_ID,
  process.env.OAUTH_GOOGLE_CLIENT_SECRET,
  'postmessage',
);

class User {

  async getGoogleUserDataFromCode(code) {
    const { tokens } = await oAuth2Client.getToken(code);
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } })
    return data
  }

  async generateTokenForUser(data) {
    const userDetails = await Models.User.findOne({ where: { emailID: data.email } })
    const detailsForToken = { userID: userDetails.userID, emailID: userDetails.emailID, firstName: userDetails.firstName, lastName: userDetails.lastName, picture: data.picture }
    const token = jwt.sign(detailsForToken, config.SECRET, { expiresIn: '1h' });
    return token
  }

  async checkIfUserExists(emailID) {
    let searchUser = await Models.User.findOne({ where: { emailID: emailID } });
    return (searchUser != null)
  }

  async signIn(code) {
    const data = await this.getGoogleUserDataFromCode(code);
    if (!(await this.checkIfUserExists(data.email))) await Models.User.create({ firstName: data.given_name, lastName: data.family_name, emailID: data.email })
    const token = await this.generateTokenForUser(data);
    return token
  }

}

module.exports = User