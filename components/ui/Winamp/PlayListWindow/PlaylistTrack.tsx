import clsx from "clsx";
import { useUnit } from "effector-react";
import React, { memo, useMemo } from "react";

import { Track } from "@/features/music/types";
import {
  $currentPlayedTrackIndex,
  $selectedTrackInPlaylist,
  doubleClickedTrackInPlaylist,
  selectTrackInPlaylist,
} from "@/src/features/winamp/playlist";

interface PlaylistTrackProps {
  track: Track;
  index: number;
}

/* @todo refactor export * from "./view" */

const PlaylistTrack = ({ track, index }: PlaylistTrackProps) => {
  const [currentIndex, selectedTrack] = useUnit([
    $currentPlayedTrackIndex,
    $selectedTrackInPlaylist,
  ]);

  const [handleSelectTrack, handleSelectNewTrack] = useUnit([
    selectTrackInPlaylist,
    doubleClickedTrackInPlaylist,
  ]);

  const firstMinute = useMemo(() => Math.floor(track.metaData.format.duration / 60), [track]);
  const lastMinute = useMemo(() => Math.floor(track.metaData.format.duration % 60), [track]);
  const seconds = useMemo(() => Math.floor(track.metaData.format.duration % 60), [track]);

  return (
    <div
      onClick={() => handleSelectTrack(index)}
      onDoubleClick={() => handleSelectNewTrack(index)}
      className={clsx(
        "flex h-[13px] max-h-[13px] min-h-[13px] select-none justify-between  px-1 text-[9px]",
        selectedTrack === index && "bg-[#0000C6]",
        currentIndex === index ? "text-white" : "text-[#00FF00] ",
      )}
    >
      <span className="truncate">
        {index + 1}. {track.artist} - {track.name}
      </span>
      <span>
        {firstMinute}:{lastMinute < 10 ? `0${lastMinute}` : seconds}
      </span>
    </div>
  );
};

export default memo(PlaylistTrack);
