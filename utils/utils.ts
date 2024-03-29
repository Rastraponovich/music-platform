const BAND_MID_POINT_VALUE = 50;
const BAND_SNAP_DISTANCE = 5;

const BALANCE_MID_POINT_VALUE = 0;
const BALANCE_SNAP_DISTANCE = 10;

/**
 * Calculates the snap band value based on the given input value.
 *
 * @param {number} value - The input value to calculate the snap band value for.
 * @return {number} - The snap band value.
 */
export const getSnapBandValue = (value: number): number => {
  const left = BAND_MID_POINT_VALUE - BAND_SNAP_DISTANCE;
  const right = BAND_MID_POINT_VALUE + BAND_SNAP_DISTANCE;

  if (value < right && value > left) {
    return BAND_MID_POINT_VALUE;
  }
  return value;
};

/**
 * Returns the snap balance value for the given input value.
 *
 * @param {number} value - The input value to calculate the snap balance value for.
 * @return {number} The snap balance value.
 */
export const getSnapBalanceValue = (value: number): number => {
  const left = BALANCE_MID_POINT_VALUE - BALANCE_SNAP_DISTANCE;
  const right = BALANCE_MID_POINT_VALUE + BALANCE_SNAP_DISTANCE;

  if (value < right && value > left) {
    return BALANCE_MID_POINT_VALUE;
  }
  return value;
};

/**
 * Converts a given time duration in seconds to a string representation in the format 'MM:SS'.
 *
 * @param {number} duration - The time duration in seconds.
 * @return {string} The string representation of the time duration in the format 'MM:SS'.
 */
export const convertTimeToString = (duration: number): string => {
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60);

  const firstSecond = Math.floor(seconds / 10);
  const lastSecond = Math.floor(seconds % 10);
  const firstMinute = Math.floor(minutes / 10);
  const lastMinute = Math.floor(minutes % 10);

  return `${firstMinute}${lastMinute}:${firstSecond}${lastSecond}`;
};

type ConvertTimeToObjectResult = {
  firstMinute: number;
  lastMinute: number;
  firstSecond: number;
  lastSecond: number;
};

/**
 * Converts a given time duration in seconds into an object containing the first and last digits of the minutes and seconds.
 *
 * @param {number} duration - The time duration in seconds.
 * @return {Object} - An object with the first and last digits of the minutes and seconds.
 */
export const convertTimeToObj = (duration: number): ConvertTimeToObjectResult => {
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60);

  const firstSecond = Math.floor(seconds / 10);
  const lastSecond = Math.floor(seconds % 10);
  const firstMinute = Math.floor(minutes / 10);
  const lastMinute = Math.floor(minutes % 10);

  return {
    firstMinute,
    lastMinute,
    firstSecond,
    lastSecond,
  };
};

/**
 * Toggles the given state.
 *
 * @param {boolean} state - The state to toggle.
 * @return {boolean} The toggled state.
 */
export const toggle = (state: boolean): boolean => !state;

/**
 * Converts a number representing seconds into a TrackTimer object with separate digits for minutes and seconds.
 *
 * @param {number} currentTime - The number of seconds.
 * @return {TrackTimer} An object containing the first and last digits for minutes and seconds.
 */
export const getMMssFromNumber = (currentTime: number) => {
  const seconds = currentTime % 60;
  const minutes = Math.floor(currentTime / 60);

  const firstSecond = Math.floor(seconds / 10);
  const lastSecond = Math.floor(seconds % 10);
  const firstMinute = Math.floor(minutes / 10);
  const lastMinute = Math.floor(minutes % 10);

  return {
    firstSecond,
    lastSecond,
    firstMinute,
    lastMinute,
  };
};

export const convertTimeToStringWithoutZeros = (duration: number): string => {
  const firstMinute = Math.floor(duration / 60);
  const lastMinute = Math.floor(duration % 60);
  const seconds = Math.floor(duration % 60);

  return `${firstMinute}:${lastMinute < 10 ? `0${lastMinute}` : seconds}`;
};
