import { TableResponse } from "../util/request/CreateTableRequest";
import { apiLink, authorizationRedirectUri, googleLoginUri, vkLoginUri } from "../util/Constants";
import { getHttpClient, HttpClient } from "../util/HttpClient";
import { UserInfoRequest } from "../util/request/UserInfoRequest";
import { IsLoggedInRequest } from "../util/request/IsLoggedInRequest";

export class User {
  readonly id!: string
  readonly name!: string
  readonly email?: string
  readonly avatar!: string
  readonly created!: Date
  readonly chats?: TableResponse[]
}

export const AuthorizationProvider = {
  google: googleLoginUri,
  vk: vkLoginUri,
}

export class State {
  get authorized(): boolean {
    return this._authorized;
  }
  private readonly checker: Promise<boolean>
  constructor() {
    this.token = localStorage.getItem("token")
    this.checker = this.checkToken()
  }

  whenReady(): Promise<State>{
    return this.checker.then(() => this)
  }

  private currentUser?: User
  private token?: string
  private _authorized: boolean = false
  private isLoading: boolean = false

  async authorize(redirectUri?: string, provider?: keyof typeof AuthorizationProvider) {
    if(this._authorized){
      return
    }

    if(await this.checkToken())
      return;

    if(!redirectUri)
      redirectUri = window.location.href

    localStorage.setItem("redirectAfterAuthorizationUri", redirectUri)

    if(!provider)
      provider = "google"

    localStorage.setItem("provider", provider)

    this.isLoading = true
    const authorizeLink = AuthorizationProvider[provider] + "?" +
      new URLSearchParams({"redirect_uri": authorizationRedirectUri}).toString();
    console.log(authorizeLink)
    window.location.href = authorizeLink
  }

  async afterAuthorize(token: string) {
    if(!this.isLoading)
      this.isLoading = true
    this.token = token
    const httpClient = getHttpClient();
    await httpClient.proceedRequest(
      new UserInfoRequest({}),
      code => {
        if(code === 401){
          console.log("User is not authorized after asking")
          this.revokeAuthorization()
          this.isLoading = false
        }
      }
    ).then(user => {
      this.currentUser = user
      this.token = token
      this._authorized = true
      this.isLoading = false
      localStorage.setItem("userId", user.id)
      localStorage.setItem("token", token)
      const redirect = localStorage.getItem("redirectAfterAuthorizationUri");
      localStorage.removeItem("redirectAfterAuthorizationUri")
      console.log("Authed user: ")
      console.log(user)
      window.location.replace(redirect)
    })
  }

  private async checkToken(): Promise<boolean>{
    const httpClient = getHttpClient();
    if(!this.token)
      return false;
    return await fetch(
      apiLink + "/user/info",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + this.token
        }
      }
    ).then(async (response) => {
      if(response.status === 200){
        this.currentUser = JSON.parse(await response.text())
        this._authorized = true
        this.isLoading = false
        localStorage.setItem("userId", this.currentUser.id)
        return true
      } else {
        console.log("User is not authorized")
        this.revokeAuthorization()
        this.isLoading = false
        return false;
      }
    });
  }

  getAuthorizationHeader(): Record<string, string>{
    return {
      "Authorization": "Bearer " + this.token
    }
  }

  revokeAuthorization(){
    this._authorized = false
    this.currentUser = null
    this.token = null
    localStorage.removeItem("userId")
    localStorage.removeItem("token")
  }
}

let state: State;
export function getState(): State{
  if(!state)
    state = new State();
  return state
}