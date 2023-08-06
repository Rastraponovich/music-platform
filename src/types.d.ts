declare type Nullable<T> = T | null;

declare global {
  interface Window {
    webkitAudioContext: {
      new (contextOptions?: AudioContextOptions | undefined): AudioContext;
      prototype: AudioContext;
    };
  }
}
