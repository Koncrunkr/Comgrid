import { authorizationRedirectUri } from "../util/Constants";
import { AuthorizationProvider, getState, State } from "./State";


window.onload = () => {
  const params = new URLSearchParams(window.location.search)

  const token = params.get("token")

  if(!token){
    console.log("Couldn't authorize user, because there was no token param");
    // window.location.href = AuthorizationProvider[provider] +
    //   encodeURIComponent(new URLSearchParams({"redirectUri": authorizationRedirectUri}).toString())
  }

  getState().whenReady().then((state) => state.afterAuthorize(token))
}