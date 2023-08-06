/**
 * Returns a formatted string that represents the volume.
 *
 * @param {number} volume - The volume to be formatted.
 * @return {string} The formatted string representing the volume.
 */
export const getMarqueInfoText = (volume: number): string => {
  return `Volume: ${Math.floor(volume)}%`;
};
