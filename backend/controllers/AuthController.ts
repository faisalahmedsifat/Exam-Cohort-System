// @ts-nocheck

import { OAuthUserData,OAuthService } from "./interfaces/OAuthService"

// Other Controllers
const UserController = require('./UserController')

// Strategy Design Pattern
export class AuthController{
  private oauthService: OAuthService;
  constructor(oauthService: OAuthService){
    this.setService(oauthService);
  }
  public setService(oauthService: OAuthService){
    this.oauthService = oauthService;
  }
  public async signIn(callback): Promise<string>{
    const userData:OAuthUserData = await this.oauthService.getUserDataFromCallback(callback);
    if(!(await UserController.checkIfUserExists(userData.emailID))) await DatabaseController.createUser({ firstName: userData.firstName, lastName: userData.lastName, emailID: userData.emailID })
    const token:string = await this.oauthService.generateTokenFromData(userData);
    return token;
  }
}
