import { getCookie, setCookie } from 'typescript-cookie';

export class CookieValue<T> {
  private _value: T;

  constructor(
    private readonly name: string,
    defaultValue: T,
    private readonly expirationDate?: number | Date,
  ) {
    const cookie = getCookie(name);
    if (cookie) this._value = JSON.parse(cookie);
    else this._value = defaultValue;
  }

  get value(): T {
    return this._value;
  }

  update(updater: (oldValue: T) => T): T {
    this._value = updater(this._value);
    setCookie(this.name, JSON.stringify(this._value), {
      expires: this.expirationDate,
    });
    return this._value;
  }
}
