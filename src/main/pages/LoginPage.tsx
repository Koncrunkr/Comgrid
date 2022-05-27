import { getState } from '../../util/State';

export const LoginPage = () => {
  const params = new URLSearchParams(window.location.search);

  const token = params.get('token');

  if (token == null) {
    console.log("Couldn't authorize user, because there was no token param");
    window.location.replace(window.location.host);
    return <></>;
  }
  console.log('Token: ' + token);

  getState()
    .whenReady()
    .then(state => state.afterAuthorize(token));

  return <></>;
};
