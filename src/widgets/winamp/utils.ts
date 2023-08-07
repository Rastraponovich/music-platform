import { EffectCallback } from "./model";

/**
 * Generates a random number within a specified range, excluding a given number.
 *
 * @param {number} max - The upper bound of the range.
 * @param {number} exp - The number to be excluded from the range.
 * @return {number} A random number within the specified range, excluding the given number.
 */
export const generateRandomId = (max: number, exp: number): number => {
  let number;

  // Generate a random number within the range, excluding the given number
  do {
    number = Math.floor(Math.random() * max);
  } while (number === exp);

  return number;
};

export const stopPlayingCb: EffectCallback = (media) => {
  media._audio.pause();
  media._audio.currentTime = 0;
};

export const startPlayFromBegginingCb: EffectCallback = (media) => {
  media._audio.currentTime = 0;
};

export const startPlayingCb: EffectCallback = (media) => {
  media._audio.play();
};

export const pausePlayingCb: EffectCallback = (media) => {
  media._audio.pause();
};
