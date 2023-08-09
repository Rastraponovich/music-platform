import { Band } from "@/features/music/types";
import { getSnapBandValue } from "@/utils/utils";

import { CHANGE_ALL_BANDS_EVENT, OFFSET, SPRITE_ELEMENT_OFFSET } from "./constants";
import type { ResetStateKey } from "./model";

/**
 * Generates preamp marque text based on the given value.
 *
 * @param {number | string} value - The value used to generate the preamp marque text.
 * @return {string} The preamp marque text.
 */
export const generatePreampMarqueText = (value: number | string): string => {
  const snapBandValue = getSnapBandValue(Number(value));
  const db = snapBandValue * 0.24 - 12;

  return `EQ: PREAMP ${db.toFixed(1)} DB`;
};

/**
 * Generates the EQ Band Marque text based on the provided value and name.
 *
 * @param {number | string} value - The value used to calculate the snap band value.
 * @param {string} name - The name of the band.
 * @return {string} The generated EQ Band Marque text.
 */
export const generateEQBandMarqueText = (value: number | string, name: string): string => {
  const snapBandValue = getSnapBandValue(Number(value));
  const db = snapBandValue * 0.24 - 12;

  return `EQ: ${name}HZ ${db.toFixed(1)} DB`;
};

/**
 * Sets the value of all bands in the provided bands object based on the specified key.
 *
 * @param {Record<Band, number>} bands - The object containing the bands and their values.
 * @param {ResetStateKey} key - The key indicating the action to be performed on the bands.
 * @return {Partial<Record<Band | string, number>>} - The updated bands object with the values set based on the key.
 */
export const setAllBands = (
  bands: Record<Band, number>,
  key: ResetStateKey,
): Record<Band, number> => {
  const bandValue = CHANGE_ALL_BANDS_EVENT[key] || 0;

  const copyBands: Partial<Record<Band | string, number>> = {};

  Object.keys(bands).forEach((band) => {
    copyBands[band] = bandValue;
  });

  return copyBands as Record<Band, number>;
};

// const calculateGainValueBandEQ = (value: number) => {
//   const db = (value / 100) * 24 - 12;
//   const gainValue = Math.pow(10, db / 20);

//   return gainValue;
// };

// const calculatePercentFromBandEQ = (gain:number = 4.8) => {
//     gain = (value / 100) * 24 - 12
//     const gainValue = Math.pow(10, db / 20)

//     return gainValue
// }

/**
 * Calculates the sprite offsets for a given number.
 *
 * @param {number} number - The number to calculate the offsets for.
 * @return {{x: number, y: number}} - The x and y offsets.
 */
export const spriteOffsets = (number: number): { x: number; y: number } => {
  const x = number % OFFSET;
  const y = Math.floor(number / OFFSET);

  return { x, y };
};

/**
 * Calculates the sprite number based on the given value.
 *
 * @param {number} value - The value to calculate the sprite number for.
 * @return {number} The calculated sprite number.
 */
export const spriteNumber = (value: number): number =>
  Math.round((value * SPRITE_ELEMENT_OFFSET) / 100);
