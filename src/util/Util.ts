import { getHttpClient } from './HttpClient';
import { UserInfoRequest } from './request/UserInfoRequest';
import { createSignal } from 'solid-js';
import { User } from './State';
import { MessageOut } from './websocket/MessageTopic';

export const closeModal = (modalRef: HTMLDivElement) => {
  modalRef.className = 'modal';
  modalRef.style.display = 'none';
  modalRef.ariaHidden = 'true';
  modalRef.removeAttribute('role');
  modalRef.removeAttribute('aria-modal');
  document.getElementsByClassName('modal-backdrop show')[0].remove();
};

export const recoverCaretPosition = (span: HTMLSpanElement, caretPosition: number) => {
  if (caretPosition === -1) return;
  try {
    const range = document.createRange();
    range.setStart(span.childNodes[0], Math.min(caretPosition, span.innerHTML.length));
    range.collapse(true);

    const selection = window.getSelection()!;

    selection.removeAllRanges();
    selection.addRange(range);
  } catch (e) {}
};

export const messagesIdEqual = (first: MessageOut, second: MessageOut) => {
  return first.x === second.x && first.y === second.y && first.chatId === second.chatId;
};

export function getParam(name: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

export const getSavedUser = (userId: string): User => {
  const existingUser = localStorage.getItem('user_' + userId);
  if (existingUser) {
    return JSON.parse(existingUser) as User;
  }
  throw new TypeError('User with id ' + userId + ' not found');
};

export function saveUser(user: User) {
  localStorage.setItem('user_' + user.id, JSON.stringify(user));
}

export async function resolveUser(userId: string): Promise<User> {
  const existingUser = localStorage.getItem('user_' + userId);
  if (existingUser) {
    return JSON.parse(existingUser) as User;
  }

  const http = getHttpClient();
  const user = await http.proceedRequest(new UserInfoRequest({ userId }));
  localStorage.setItem('user_' + userId, JSON.stringify(user));
  return user;
}

export function formatDateTime(date: Date): string {
  const today = new Date();
  const outDate = date.toDateString();
  if (today.toDateString() === outDate) {
    return date.toLocaleTimeString('ru-RU');
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
