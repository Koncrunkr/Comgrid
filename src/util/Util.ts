import { getHttpClient } from './HttpClient';
import { UserInfoRequest, UserResponse } from './request/UserInfoRequest';
import { createSignal } from 'solid-js';

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

let windowSize: () => [number, number];
let setWindowSize: (size: [number, number]) => unknown;
const updateSize = () => {
  setWindowSize([window.innerWidth, window.innerHeight]);
};
let initialized: boolean = false;
export const useWindowSize: () => [
  () => [number, number],
  (size: [number, number]) => unknown,
] = () => {
  if (initialized) {
    return [windowSize, setWindowSize];
  }
  [windowSize, setWindowSize] = createSignal([0, 0]);
  window.addEventListener('resize', updateSize);
  updateSize();

  initialized = true;
  return [windowSize, setWindowSize];
};
