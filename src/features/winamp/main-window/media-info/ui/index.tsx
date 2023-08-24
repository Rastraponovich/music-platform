import { useUnit } from "effector-react";
import { useMemo } from "react";
import { WINAMP_STATE } from "~/entity/winamp";

import { $currentTrack, $mediaStatus, winampStates } from "~/widgets/winamp";

import { $currentPlayedTrackIndex } from "../../../playlist";
import { KBPS, KHZ, MonoStereo } from "./info";
import { Ticker } from "./ticker";

/**
 *
 * @deprecated
 */
export const MediaInfo = () => {
  const [currentTrack, currentId] = useUnit([$currentTrack, $currentPlayedTrackIndex]);
  const [playerState, winampState] = useUnit([$mediaStatus, winampStates.$winampState]);

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
