import { MEDIA_STATUS } from "@/features/media/constants";
import { eq, winamp, winampControls } from "@/src/widgets/winamp";
import { createEvent, sample } from "effector";

export const prevTrackButtonClicked = createEvent();
export const pauseButtonClicked = createEvent();
export const playButtonClicked = createEvent();
export const stopButtonClicked = createEvent();
export const loopToggled = createEvent();
export const shuffleToggled = createEvent();
export const nextTrackButtonClicked = createEvent();
export const eqVisibilityToggled = createEvent();

/**
 * @todo Fix names of variables in this function. move reducer
 */
export const $isPlaying = winamp.$mediaStatus.map((status) => status === "PLAYING");

export const $loopIsOn = winamp.$loop.map((loop) => loop);

export const $shuffled = winamp.$shuffle.map((shuffled) => shuffled);

export const $eqVisible = eq.$visibleEQ.map((visible) => visible);

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
  target: eq.toggleVisibleEQ,
});
