const BAND_MID_POINT_VALUE = 50;
const BAND_SNAP_DISTANCE = 5;

const BALANCE_MID_POINT_VALUE = 0;
const BALANCE_SNAP_DISTANCE = 5;

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

/**
 * Converts a given time duration in seconds into an object containing the first and last digits of the minutes and seconds.
 *
 * @param {number} duration - The time duration in seconds.
 * @return {Object} - An object with the first and last digits of the minutes and seconds.
 */
export const convertTimeToObj = (duration: number) => {
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
