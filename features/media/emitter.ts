export default class Emitter {
  _listeners: { [event: string]: Array<(...args: unknown[]) => void> };

  constructor() {
    this._listeners = {};
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    const eventListeners = this._listeners[event] || [];

    eventListeners.push(callback);
    this._listeners[event] = eventListeners;
    const unsubscribe = () => {
      this._listeners[event] = eventListeners.filter((callback) => callback !== callback);
    };

    return unsubscribe;
  }

  trigger(event: string, ...args: unknown[]) {
    const callbacks = this._listeners[event];

    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  }

  dispose() {
    this._listeners = {};
  }
}
