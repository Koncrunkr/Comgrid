import { getHttpClient } from './HttpClient';
import { UserInfoRequest } from './request/UserInfoRequest';
import { createSignal } from 'solid-js';
import { User } from './State';
import { getCookie, setCookie } from 'typescript-cookie';
import { MessageOut } from './websocket/MessageTopic';

export const messagesIdEqual = (first: MessageOut, second: MessageOut) => {
  return first.x === second.x && first.y === second.y && first.chatId === second.chatId;
};

export function getParam(name: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

export const getSavedUser = (userId: string): User => {
  const existingUser = getCookie('user_' + userId);
  if (existingUser) {
    return JSON.parse(existingUser) as User;
  }
  throw new TypeError('User with id ' + userId + ' not found');
};

export async function resolveUser(userId: string): Promise<User> {
  const existingUser = getCookie('user_' + userId);
  if (existingUser) {
    return JSON.parse(existingUser) as User;
  }

  const http = getHttpClient();
  const user = await http.proceedRequest(new UserInfoRequest({ userId }));
  setCookie('user_' + userId, JSON.stringify(user), {
    expires: 10, // days
  });
  return user;
}
//104464598721841231716
//104464598721841231716
export function formatDateTime(date: Date): string {
  const today = new Date();
  const outDate = date.toDateString();
  if (today.toDateString() === outDate) {
    return date.toLocaleTimeString();
  }
  return outDate;
}

export function slice2DArray<T>(
  array: T[][],
  fromXInclusive: number,
  toXInclusive: number,
  fromYInclusive: number,
  toYInclusive: number,
): T[][] {
  return array
    .slice(fromXInclusive, toXInclusive + 1)
    .map(arr => arr.slice(fromYInclusive, toYInclusive + 1));
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
