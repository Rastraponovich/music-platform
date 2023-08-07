import { convertTimeToString } from "@/utils/utils";

/**
 * Generates the information text to display while seeking in a media player.
 *
 * @param {number} seekingValue - The current position in the media, in milliseconds.
 * @param {number} duration - The total duration of the media, in milliseconds.
 * @return {string} The information text to display, showing the current position and duration, as well as the percentage of progress.
 */
export const generateMarqueSeekText = (seekingValue: number, duration: number): string => {
  const percent = Math.floor((seekingValue / duration) * 100);

  const currentTime = convertTimeToString(seekingValue);
  const currentDuration = convertTimeToString(duration);

  return `Seek To: ${currentTime}/${currentDuration} (${percent}%)`;
};
