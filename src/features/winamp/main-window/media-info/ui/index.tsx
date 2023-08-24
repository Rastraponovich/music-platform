import { useUnit } from "effector-react";
import { useMemo } from "react";
import { WINAMP_STATE } from "~/entity/winamp";

import { winamp, winampStates } from "@/src/widgets/winamp/model";

import { $currentPlayedTrackIndex } from "../../../playlist";
import { KBPS, KHZ, MonoStereo } from "./info";
import { Ticker } from "./ticker";

/**
 *
 * @deprecated
 */
export const MediaInfo = () => {
  const currentTrack = useUnit(winamp.$currentTrack);
  const currentId = useUnit($currentPlayedTrackIndex);
  const playerState = useUnit(winamp.$mediaStatus);
  const winampState = useUnit(winampStates.$winampState);

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
