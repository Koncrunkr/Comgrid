export class CookieValue<T> {
  private _value: T;

  constructor(private readonly name: string, defaultValue: T) {
    const cookie = localStorage.getItem(name);
    if (cookie) this._value = JSON.parse(cookie);
    else this._value = defaultValue;
  }

  get value(): T {
    return this._value;
  }

  update(updater: (oldValue: T) => T): T {
    this._value = updater(this._value);
    localStorage.setItem(this.name, JSON.stringify(this._value));
    return this._value;
  }
}
