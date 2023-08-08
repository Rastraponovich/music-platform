import { useList, useUnit } from "effector-react";

import { playlist, winamp } from "@/src/widgets/winamp/model";

import PlaylistTrack from "./PlaylistTrack";

const DEFAULT_HEIGHT = 151;

const Playlist = () => {
  const playlistLength = useUnit(playlist.$playlistLength);
  const currentIndex = useUnit(playlist.$currentPlayedTrackIndex);
  const playingState = useUnit(winamp.$mediaStatus);
  const selectedTrack = useUnit(playlist.$selectedTrackInPlayList);

  return (
    <div
      className={
        "flex  max-h-[151px] min-h-[150px] grow cursor-winamp scroll-px-4  flex-col overflow-y-auto bg-black py-1 shadow-lg"
      }
      style={{ height: DEFAULT_HEIGHT }}
    >
      {useList(playlist.$playlist, {
        keys: [playlistLength, currentIndex, playingState, selectedTrack],
        fn: (track, index) => <PlaylistTrack track={track} index={index} />,
      })}
    </div>
  );
};

export default Playlist;
