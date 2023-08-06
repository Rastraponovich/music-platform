import { convertTimeToString } from "@/utils/utils";

export const getMarqueInfoText = (seekingValue: number, duration: number): string => {
  const percent = Math.floor((seekingValue / duration) * 100);

  const currentTime = convertTimeToString(seekingValue);
  const currentDuration = convertTimeToString(duration);

  return `Seek To: ${currentTime}/${currentDuration} (${percent}%)`;
};
