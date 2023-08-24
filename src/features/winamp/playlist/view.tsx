import clsx from "clsx";
import { useList, useUnit } from "effector-react";
import dynamic from "next/dynamic";
import { memo, useMemo, useRef } from "react";
import type { MouseEventHandler } from "react";

import type { Track } from "@/features/music/types";
import { convertTimeToString } from "@/utils/utils";

import {
  $activeWindow,
  $currentTrackDuration,
  $mediaStatus,
  changeWindowState,
} from "~/widgets/winamp";

import { MiniActions } from "~/features/winamp/controls-panel";
import {
  $currentPlayedTrackIndex,
  $durationTracksInPlaylist,
  $playlist,
  $playlistLength,
  $selectedTrackInPlaylist,
  $visiblePlaylist,
  doubleClickedTrackInPlaylist,
  selectTrackInPlaylist,
} from "~/features/winamp/playlist";

import { useDraggable } from "~/shared/hooks/use-draggable";
import { CharacterStrings } from "~/shared/ui/winamp/character-strings";

import { MiniTimer } from "../mini-timer";
import { WINDOW_NAME } from "./constants";

const OptionMenu = dynamic(() => import("../menu").then(({ OptionMenu }) => OptionMenu), {
  ssr: false,
});
const AddMenu = dynamic(() => import("../menu").then(({ AddMenu }) => AddMenu), { ssr: false });

export const PlayListWindow = () => {
  const ref = useRef(null);

  const handleActiveWindow = useUnit(changeWindowState);
  const [visible, currentTrackDuration, totalDuration] = useUnit([
    $visiblePlaylist,
    $currentTrackDuration,
    $durationTracksInPlaylist,
  ]);

  const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref);

  const trackLength = useMemo(
    () => `${convertTimeToString(currentTrackDuration)}/${convertTimeToString(totalDuration)}`,
    [currentTrackDuration, totalDuration],
  );

  return (
    <aside
      className={clsx(
        "font-[15px] fixed top-[232px] z-50  flex min-w-[275px] cursor-winamp flex-col font-[Arial] text-[#00FF00] pixelated",
        !visible && "hidden",
      )}
      ref={ref}
      onClick={() => handleActiveWindow(WINDOW_NAME)}
    >
      <PlaylistHeader
        onMouseDown={onDragStart}
        onMouseMove={onDragging}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      />
      <div className="flex">
        <div
          style={{
            backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAdAgMAAADjkWVKAAAADFBMVEUAAAAdHS0pKUBqano8VvpZAAAAD0lEQVQI12OoilvCQGcMALzxKw1EtyFgAAAAAElFTkSuQmCC)`,
          }}
          className="w-3 min-w-[12px] bg-repeat-y"
        ></div>
        <Playlist />
        <div
          className="min-w-5 relative w-5 bg-repeat-y pb-[18px]"
          style={{
            backgroundPosition: "100% 0",
            backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAdAgMAAADX6KRWAAAADFBMVEUAAAAdHS0pKUBqano8VvpZAAAAEklEQVQI12OwmrXq1UuGIUICAIEjYC7HaOXEAAAAAElFTkSuQmCC)`,
          }}
        ></div>
      </div>
      <div className="playlist-bottom draggable relative h-[38px] max-h-[38px] min-h-[38px] w-full cursor-winamp-move">
        <div className="playlist-bottom-left draggable absolute flex h-full w-[125px] cursor-winamp justify-between pl-2.5 pr-[3px] pt-2 pb-3">
          <AddMenu />
          <AddMenu />
          <AddMenu />
          <AddMenu />
        </div>
        <div className="playlist-bottom-center draggable"></div>
        <div className="playlist-bottom-right draggable absolute right-0  flex h-full  w-[150px] px-0.5 py-1.5 text-[9px]">
          <div className="flex w-24 flex-col ">
            <span className="mb-[2px] flex h-[13.5px] items-center pl-[5px]">
              <CharacterStrings>{trackLength}</CharacterStrings>
            </span>
            <div className="flex">
              <MiniActions bottom />
              <MiniTimer className="ml-[3px] pt-px" />
            </div>
          </div>
          <OptionMenu />
        </div>
      </div>
    </aside>
  );
};

interface PlaylistHeaderProps {
  onMouseDown: MouseEventHandler;
  onMouseMove: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
}

const PlaylistHeader = memo<PlaylistHeaderProps>(
  ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }) => {
    const windowState = useUnit($activeWindow);

    return (
      <div
        className={clsx(
          "playlist-top draggable relative flex min-h-[20px] w-full min-w-[20px] cursor-winamp-move",
          windowState === WINDOW_NAME && "active",
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className="playlist-top-left draggable w-[25px]"></div>
        <div className="playlist-top-left-spacer draggable w-3"></div>
        <div className="playlist-top-left-fill draggable grow "></div>
        <div className="playlist-top-title draggable w-[100px]"></div>
        <div className="playlist-top-right-spacer draggable w-[13px]"></div>
        <div className="playlist-top-right-fill draggable grow"></div>
        <div className="playlist-top-right draggable w-[25px]">
          <div id="playlist-shade-button" className=""></div>
          <div id="playlist-close-button" className=""></div>
        </div>
      </div>
    );
  },
);

PlaylistHeader.displayName = "PlaylistHeader";

const DEFAULT_HEIGHT = 151;

const Playlist = () => {
  const [playlistLength, currentIndex, selectedTrack, playingState] = useUnit([
    $playlistLength,
    $currentPlayedTrackIndex,
    $selectedTrackInPlaylist,
    $mediaStatus,
  ]);

  return (
    <div
      className={
        "flex  max-h-[151px] min-h-[150px] grow cursor-winamp scroll-px-4  flex-col overflow-y-auto bg-black py-1 shadow-lg"
      }
      style={{ height: DEFAULT_HEIGHT }}
    >
      {useList($playlist, {
        keys: [playlistLength, currentIndex, playingState, selectedTrack],
        fn: (track, index) => <PlaylistTrack track={track} index={index} />,
      })}
    </div>
  );
};

interface PlaylistTrackProps {
  track: Track;
  index: number;
}

const PlaylistTrack = memo<PlaylistTrackProps>(({ track, index }) => {
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
});

PlaylistTrack.displayName = "PlaylistTrack";
