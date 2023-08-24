import { useUnit } from "effector-react";
import { useEffect } from "react";

import { WINAMP_WINDOW_STATE } from "@/features/music/constants";
import {
  $playlistLength,
  $selectedTrackInPlaylist,
  doubleClickedTrackInPlaylist,
  selectTrackInPlaylist,
} from "@/src/features/winamp/playlist";
import { keyChangeCurrentTime } from "@/src/features/winamp/progress-bar/model";
import { keyboardVolumeChanged } from "@/src/features/winamp/volume-bar/model";
import { $activeWindow, removeTrackFromPlaylist } from "@/src/widgets/winamp/model";

const useChangeCurentTime = () => {
  const changeCurrentTime = useUnit(keyChangeCurrentTime);

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      if (event.key === "ArrowLeft") return changeCurrentTime("backward");

      if (event.key === "ArrowRight") return changeCurrentTime("forward");
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("keypress", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keypress", handler);
    };
  }, []);
};

export const useChangeCurrentVolume = () => {
  const handleSetVolume = useUnit(keyboardVolumeChanged);
  const activeWindow = useUnit($activeWindow);
  const [currentPosition, handleSelect, itemsLength] = useUnit([
    $selectedTrackInPlaylist,
    selectTrackInPlaylist,
    $playlistLength,
  ]);

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      const isArrowKey = event.key === "ArrowUp" || event.key === "ArrowDown";
      const isPlayerWindow = activeWindow === "PLAYER";
      const isPlaylistWindow = activeWindow === "PLAYLIST";
      const isCurrentPositionNotNull = currentPosition !== null;
      const isArrowUpKey = event.key === "ArrowUp";
      const isArrowDownKey = event.key === "ArrowDown";

      if (isPlayerWindow && isArrowKey) {
        return handleSetVolume(event);
      }

      if (isPlaylistWindow && isCurrentPositionNotNull) {
        event.preventDefault();

        const nextItem = currentPosition > 0 ? currentPosition - 1 : itemsLength - 1;
        const prevItem = currentPosition === itemsLength - 1 ? 0 : currentPosition + 1;

        if (isArrowUpKey) {
          return handleSelect(nextItem);
        }

        if (isArrowDownKey) {
          return handleSelect(prevItem);
        }
      }
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("keypress", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keypress", handler);
    };
  }, [handleSelect, handleSetVolume, itemsLength, currentPosition, activeWindow]);
};

const useDelPressKeyButton = () => {
  const activeWindow = useUnit($activeWindow);
  const [handleDelete, handleSelect, hanldeDoubleClick] = useUnit([
    removeTrackFromPlaylist,
    selectTrackInPlaylist,
    doubleClickedTrackInPlaylist,
  ]);

  const [itemsLength, selectedItem] = useUnit([$playlistLength, $selectedTrackInPlaylist]);

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      const { key } = event;
      const selectedItemNotNull = selectedItem !== null;

      if (
        key === "Delete" &&
        selectedItemNotNull &&
        activeWindow === WINAMP_WINDOW_STATE.PLAYLIST
      ) {
        return handleDelete(selectedItem);
      }

      if (key === "Enter" && selectedItemNotNull) {
        event.preventDefault();
        return hanldeDoubleClick(selectedItem);
      }
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("keypress", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keypress", handler);
    };
  }, [activeWindow, handleDelete, handleSelect, hanldeDoubleClick, itemsLength, selectedItem]);
};

export { useChangeCurentTime, useDelPressKeyButton };
