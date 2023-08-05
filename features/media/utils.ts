/**
 * Clamps a value between a minimum and maximum.
 *
 * @param {number} value - The value to be clamped.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @return {number} The clamped value.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
