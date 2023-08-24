import { winamp } from "~/widgets/winamp";

//<-- problem

export const $currentTrack = winamp.$currentTrack.map((track) => track);

export const $bitrate = $currentTrack.map((track) => track?.metaData.format.bitrate ?? 0);
export const $sampleRate = $currentTrack.map((track) => track?.metaData.format.sampleRate ?? 0);
export const $numberOfChannels = $currentTrack.map(
  (track) => track?.metaData.format.numberOfChannels ?? 0,
);
