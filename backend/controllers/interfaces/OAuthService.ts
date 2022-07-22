export interface OAuthUserData{
  firstName: string,
  lastName: string,
  emailID: string,
  picture: string
}

export interface OAuthService{
  getUserDataFromCallback(callback): Promise<OAuthUserData>;
  generateTokenFromData(userData: OAuthUserData): Promise<string>;
}

