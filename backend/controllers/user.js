const axios = require('axios')

// Models
const Models = require('../models')

// OAuth Helpers
const {
    OAuth2Client
} = require('google-auth-library');
const oAuth2Client = new OAuth2Client(
    process.env.OAUTH_GOOGLE_CLIENT_ID,
    process.env.OAUTH_GOOGLE_CLIENT_SECRET,
    'postmessage',
);

class User {

    getGoogleUserDataFromCode(code) {
        const {
            tokens
        } = await oAuth2Client.getToken(code);
        const {
            data
        } = await axios.get('https://w...content-available-to-author-only...s.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        })
        return data
    }

    generateTokenFromData(data) {
        const detailsForToken = {
            userID: uuid(),
            emailID: data.email,
            firstName: targetUser.given_name,
            lastName: targetUser.family_name
        }
        return jwt.sign(detailsForToken, config.SECRET, {
            expiresIn: '1h'
        });
    }

    signIn(code) {
        try {
            const data = this.getGoogleUserDataFromCode(code);
            const token = generateTokenFromData(data);
            return response
                .status(200)
                .send(middleware.generateApiOutput("OK", token))
        } catch (error) {
            return response.status(500).json(middleware.generateApiOutput("FAILED", "Internal Server Error!"))
        }
    }
}


module.exports = User