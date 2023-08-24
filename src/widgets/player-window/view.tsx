import { useUnit } from "effector-react";
import { $bitrate, $numberOfChannels, $sampleRate } from "~/entity/winamp";

import { KBPS, KHZ, MonoStereo, Ticker } from "~/features/winamp/media-info";

import { $currentTrackId, $isPlayerNotStopped, $showingTicker, $track } from "./model";

export const MediaInfo = () => {
  const [isPlayerNotStopped, track, currentId] = useUnit([
    $isPlayerNotStopped,
    $track,
    $currentTrackId,
  ]);
  const showingTicker = useUnit($showingTicker);

  const [bitrate, sampleRate, numberOfChannels] = useUnit([
    $bitrate,
    $sampleRate,
    $numberOfChannels,
  ]);

  return (
    <div className="media-info flex text-[#00FF00]">
      {showingTicker && <Ticker currentTrack={track!} currentId={currentId!} />}
      {isPlayerNotStopped && (
        <>
          <KBPS bitrate={bitrate} />
          <KHZ sampleRate={sampleRate} />
        </>
      )}
      <MonoStereo numberOfChannels={numberOfChannels} />
    </div>
  );
};
