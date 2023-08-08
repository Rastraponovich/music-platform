import clsx from "clsx";
import { useUnit } from "effector-react/scope";
import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";

import { MiniActions } from "@/src/features/winamp/controls-panel";
import { $durationTracksInPlaylist, $visiblePlaylist } from "@/src/features/winamp/playlist";
import { useDraggable } from "@/src/shared/hooks/use-draggable";
import { CharacterStrings } from "@/src/shared/ui/winamp/character-strings";
import { $currentTrackDuration, winampStates } from "@/src/widgets/winamp/model";
import { convertTimeToString } from "@/utils/utils";

import Playlist from "../Playlist";
import PlaylistHeader from "../PlaylistHeader";
import { MiniTimer } from "../mini-timer";

const OptionMenu = dynamic(() => import("../PlaylistMenus/OptionMenu"), { ssr: false });
const AddMenu = dynamic(() => import("../PlaylistMenus/AddMenu"), { ssr: false });

//  const DEFAULT_HEIGHT = 151;

const WINDOW_NAME = "PLAYLIST";

const PlayListWindow = () => {
  const ref = useRef(null);

  const handleActiveWindow = useUnit(winampStates.changeWindowState);
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

export default PlayListWindow;
