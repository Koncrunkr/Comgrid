import { getHttpClient } from './HttpClient';
import { UserInfoRequest, UserResponse } from './request/UserInfoRequest';

export function getParam(name: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

export async function resolveUser(userId: string): Promise<UserResponse> {
  const http = getHttpClient();
  const existingUser = localStorage.getItem(userId);
  if (existingUser) return JSON.parse(existingUser) as UserResponse;
  const user = await http.proceedRequest(new UserInfoRequest({ userId }));
  localStorage.setItem(userId, JSON.stringify(user));
  return user;
}

export function formatDateTime(date: Date): string {
  const today = new Date();
  const outDate = date.toDateString();
  if (today.toDateString() === outDate) {
    return date.toLocaleTimeString();
  }
  return outDate;
}
