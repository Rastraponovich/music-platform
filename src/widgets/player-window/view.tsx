import { useUnit } from "effector-react";

import { $bitrate, $numberOfChannels, $sampleRate } from "@/src/entity/winamp";
import { KBPS, KHZ, MonoStereo } from "@/src/features/winamp/main-window/media-info/ui/info";
import { Ticker } from "@/src/features/winamp/main-window/media-info/ui/ticker";

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
