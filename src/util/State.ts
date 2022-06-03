import { TableResponse } from './request/CreateTableRequest';
import {
  apiLink,
  authorizationRedirectUri,
  googleLoginUri,
  vkLoginUri,
} from './Constants';
import { getHttpClient } from './HttpClient';
import { UserInfoRequest } from './request/UserInfoRequest';
import { setCookie } from 'typescript-cookie';

export class User {
  readonly id!: string;
  readonly name!: string;
  readonly email?: string;
  readonly avatar!: {
    link: string;
  };
  readonly created!: Date;
  readonly chats?: TableResponse[];
  readonly color?: string;
}

export const AuthorizationProvider = {
  google: googleLoginUri,
  vk: vkLoginUri,
};

export class State {
  private readonly checker: Promise<boolean>;
  private currentUser?: User;
  private token?: string;
  private isLoading: boolean = false;

  constructor() {
    this.token = localStorage.getItem('token') ?? undefined;
    this.checker = this.checkToken();
  }

  private _authorized: boolean = false;

  get authorized(): boolean {
    return this._authorized;
  }

  whenReady(): Promise<State> {
    return this.checker.then(() => this);
  }

  async authorize(redirectUri?: string, provider?: keyof typeof AuthorizationProvider) {
    if (this._authorized) {
      return;
    }

    if (await this.checkToken()) return;

    if (!redirectUri) redirectUri = window.location.href;

    localStorage.setItem('redirectAfterAuthorizationUri', redirectUri);

    if (!provider) provider = 'google';

    localStorage.setItem('provider', provider);

    this.isLoading = true;
    const authorizeLink =
      AuthorizationProvider[provider] +
      '?' +
      new URLSearchParams({ redirect_uri: authorizationRedirectUri }).toString();
    console.log(authorizeLink);
    window.location.href = authorizeLink;
  }

  async afterAuthorize(token: string) {
    if (!this.isLoading) this.isLoading = true;
    this.token = token;
    const httpClient = getHttpClient();
    await httpClient
      .proceedRequest(new UserInfoRequest({}), code => {
        if (code === 401) {
          console.log('User is not authorized after asking');
          this.revokeAuthorization();
          this.isLoading = false;
        }
      })
      .then(user => {
        this.currentUser = user;
        this.token = token;
        this._authorized = true;
        this.isLoading = false;
        setCookie('userId', user.id);
        localStorage.setItem('user_' + user.id, JSON.stringify(user));
        localStorage.setItem('token', token);
        const redirect = localStorage.getItem('redirectAfterAuthorizationUri');
        localStorage.removeItem('redirectAfterAuthorizationUri');
        console.log('Authed user: ');
        console.log(user);
        // let navigate = useNavigate();
        // let url = redirect ?? window.location.host + '/';
        // navigate(url, {
        //   replace: true,
        // });
        window.location.replace(redirect ?? 'http://' + window.location.host);
      });
  }

  getAuthorizationHeader(): Record<string, string> {
    return {
      Authorization: 'Bearer ' + this.token,
    };
  }

  revokeAuthorization() {
    this._authorized = false;
    this.currentUser = undefined;
    this.token = undefined;
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  }

  private async checkToken(): Promise<boolean> {
    if (!this.token) return false;
    return await fetch(apiLink + '/user/info', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      },
    }).then(async response => {
      if (response.status === 200) {
        this.currentUser = JSON.parse(await response.text());
        this._authorized = true;
        this.isLoading = false;
        localStorage.setItem('userId', this.currentUser!.id);
        return true;
      } else {
        console.log('User is not authorized');
        this.revokeAuthorization();
        this.isLoading = false;
        return false;
      }
    });
  }
}

let state: State;

export function getState(): State {
  if (!state) state = new State();
  return state;
}
