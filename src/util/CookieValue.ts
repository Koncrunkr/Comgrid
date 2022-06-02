import { getCookie, setCookie } from 'typescript-cookie';

export class CookieValue<T> {
  private _value: T;

  constructor(
    private readonly name: string,
    private readonly expirationDate?: number | Date,
  ) {
    this._value = getCookie(name, {
      decodeValue: value => JSON.parse(value),
    });
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
