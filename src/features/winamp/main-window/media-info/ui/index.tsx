import { useStore } from "effector-react";

import { playlist, winamp, winampStates } from "@/src/widgets/winamp/model";

import { Ticker } from "./ticker";
import { WINAMP_STATE } from "@/features/music/constants";
import { useMemo } from "react";
import { KBPS, MonoStereo, KHZ } from "./info";

/**
 *
 * @deprecated
 */
export const MediaInfo = () => {
  const currentTrack = useStore(winamp.$currentTrack);
  const currentId = useStore(playlist.$currentPlayedTrackIndex);
  const playerState = useStore(winamp.$mediaStatus);
  const winampState = useStore(winampStates.$winampState);

  const allow = useMemo(
    () => currentTrack !== null && winampState !== WINAMP_STATE.CLOSED,
    [currentTrack, winampState],
  );

  return (
    <div className="media-info flex text-[#00FF00]">
      {allow && <Ticker currentTrack={currentTrack!} currentId={currentId!} />}
      {playerState !== "STOPPED" && (
        <>
          <KBPS bitrate={currentTrack?.metaData.format.bitrate || 0} />
          <KHZ sampleRate={currentTrack?.metaData.format.sampleRate || 0} />
        </>
      )}
      <MonoStereo numberOfChannels={currentTrack?.metaData.format.numberOfChannels || 0} />
    </div>
  );
};
