import { createEvent, sample } from "effector";

import { $shuffled as $baseShuffled, $loop, $mediaStatus, winampControls } from "~/widgets/winamp";

import { $visibleEQ, toggleVisibleEQ } from "../equalizer";
import { $visiblePlaylist, toggleVisiblePlaylist } from "../playlist";

export const loopToggled = createEvent();
export const shuffleToggled = createEvent();
export const playButtonClicked = createEvent();
export const stopButtonClicked = createEvent();
export const pauseButtonClicked = createEvent();
export const eqVisibilityToggled = createEvent();
export const toggledPlaylist = createEvent();
export const nextTrackButtonClicked = createEvent();
export const prevTrackButtonClicked = createEvent();

/**
 * @todo Fix names of variables in this function. move reducer
 */
export const $isPlaying = $mediaStatus.map((status) => status === "PLAYING");

export const $loopIsOn = $loop.map((loop) => loop);

export const $shuffled = $baseShuffled.map((shuffled) => shuffled);

export const $eqVisible = $visibleEQ.map((visible) => visible);

export const $visibledPlaylist = $visiblePlaylist.map((visible) => visible);

sample({
  clock: toggledPlaylist,
  target: toggleVisiblePlaylist,
});

/**
 * on play button clicked
 */
sample({
  clock: playButtonClicked,
  target: winampControls.play,
});

/**
 * on prev track button clicked
 */
sample({
  clock: prevTrackButtonClicked,
  target: winampControls.prevTrack,
});

/**
 * on next track button clicked
 */
sample({
  clock: nextTrackButtonClicked,
  target: winampControls.nextTrack,
});

/**
 * on pause button clicked
 */
sample({
  clock: pauseButtonClicked,
  target: winampControls.pause,
});

/**
 * on stop button clicked
 */
sample({
  clock: stopButtonClicked,
  target: winampControls.stop,
});

/**
 * on loop toggled
 */
sample({
  clock: loopToggled,
  target: winampControls.toggleLoop,
});

/**
 * on shuffle toggled
 */
sample({
  clock: shuffleToggled,
  target: winampControls.toggleShuffle,
});

/**
 * on eq visibility toggled
 */
sample({
  clock: eqVisibilityToggled,
  target: toggleVisibleEQ,
});
