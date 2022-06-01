export const apiLink = import.meta.env.VITE_API_LINK ?? 'https://comgrid.ru:8443';
export const vkLoginUri =
  apiLink + (import.meta.env.VITE_VK_LOGIN_URI ?? '/oauth2/authorize/vk');
export const googleLoginUri =
  apiLink + (import.meta.env.VITE_GOOGLE_LOGIN_URI ?? '/oauth2/authorize/google');

export const authorizationRedirectUri =
  apiLink + (import.meta.env.VITE_AUTHORIZATION_REDIRECT_URI ?? '/login');
