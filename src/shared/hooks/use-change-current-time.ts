import { playlist, progress, winampStates } from "@/src/widgets/winamp/model";
import { WINAMP_WINDOW_STATE } from "@/features/music/constants";
import { useUnit } from "effector-react";
import { useEffect } from "react";
import { keyboardVolumeChanged } from "@/src/features/winamp/volume-bar/model";

const useChangeCurentTime = () => {
  const changeCurrentTime = useUnit(progress.keyChangeCurrentTime);

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

const useDelPressKeyButton = () => {
  const activeWindow = useUnit(winampStates.$activeWindow);
  const handleDeleteTrackFormPlaylist = useUnit(playlist.removeTrackFromPlaylist);
  const selectedTrackInPlayList = useUnit(playlist.$selectedTrackInPlayList);
  const handleSelectTrackInPlaylist = useUnit(playlist.selectTrackInPlaylist);
  const playTrack = useUnit(playlist.doubleClick);
  const playlistLength = useUnit(playlist.$playlistLength);

  const handleSetVolume = useUnit(keyboardVolumeChanged);

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Delete") {
        if (activeWindow === WINAMP_WINDOW_STATE.PLAYLIST) {
          return handleDeleteTrackFormPlaylist(selectedTrackInPlayList!);
        }
      }

      if (event.key === "ArrowUp") {
        if (activeWindow === WINAMP_WINDOW_STATE.PLAYER) {
          event.preventDefault();
          handleSetVolume("up");
        }

        if (activeWindow === WINAMP_WINDOW_STATE.PLAYLIST) {
          if (selectedTrackInPlayList !== null) {
            event.preventDefault();

            if (selectedTrackInPlayList > 0)
              return handleSelectTrackInPlaylist(selectedTrackInPlayList - 1);

            return handleSelectTrackInPlaylist(playlistLength - 1);
          }
        }
      }

      if (event.key === "ArrowDown") {
        if (activeWindow === WINAMP_WINDOW_STATE.PLAYER) {
          event.preventDefault();
          handleSetVolume("down");
        }

        if (activeWindow === WINAMP_WINDOW_STATE.PLAYLIST) {
          if (selectedTrackInPlayList !== null) {
            event.preventDefault();

            if (selectedTrackInPlayList === playlistLength - 1)
              return handleSelectTrackInPlaylist(0);

            return handleSelectTrackInPlaylist(selectedTrackInPlayList + 1);
          }
        }
      }

      if (event.key === "Enter") {
        if (selectedTrackInPlayList !== null) {
          event.preventDefault();
          playTrack(selectedTrackInPlayList);
        }
      }
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("keypress", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keypress", handler);
    };
  }, [
    activeWindow,
    handleDeleteTrackFormPlaylist,
    handleSelectTrackInPlaylist,
    handleSetVolume,
    playTrack,
    playlistLength,
    selectedTrackInPlayList,
  ]);
};

export { useChangeCurentTime, useDelPressKeyButton };
