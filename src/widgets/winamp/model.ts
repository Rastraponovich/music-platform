import { attach, createEffect, createEvent, createStore, sample, scopeBind } from "effector";
import { not, reset } from "patronum";
import { BANDS, MEDIA_STATUS, WINAMP_STATE, WINAMP_WINDOW_STATE } from "~/entity/winamp/constants";

import {
  Band,
  MediaElement,
  MediaStatus,
  StereoBalanceNodeType,
  TPreset,
  TWinampState,
  TimeMode,
  Track,
  WinampWindow,
  _Bands,
} from "@/features/music/types";
import type { Nullable } from "@/types";
import { baseSkinColors } from "@/types/ui.types";
import { getMMssFromNumber, getSnapBandValue, toggle } from "@/utils/utils";

import { getClientScope } from "~/shared/hooks/use-scope";
import { StereoBalanceNode } from "~/shared/lib/audio/stereo-balance-node";

import {
  pausePlayingCb,
  playNextTrackIsOneInPlayListCb,
  startPlayFromBegginingCb,
  startPlayingCb,
  stopPlayingCb,
} from "./utils";

export { $currentTrack };

declare global {
  interface Window {
    webkitAudioContext: {
      new (contextOptions?: AudioContextOptions | undefined): AudioContext;
      prototype: AudioContext;
    };
  }
}

type TimeDirection = "forward" | "backward" | string;

export type EffectCallback = (media: MediaElement) => void;

/**
 * @todo export
 */
type TrackTimer = {
  firstSecond: number;
  lastSecond: number;
  lastMinute: number;
  firstMinute: number;
};

/* todo export */
const loadUrlFx = createEffect<{ media: Nullable<MediaElement>; track: Track }, Track>(
  ({ media, track }) => {
    if (media) {
      media._audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`;
    }

    return track;
  },
);

const Emitter = {
  onDurationChange: (event: Event) => {
    const audioElement = event.currentTarget as HTMLAudioElement;
    const callSetDuration = scopeBind(setDuration, { scope: getClientScope()! });

    callSetDuration(audioElement.duration);
  },

  onEnded: () => {
    const callPlayNextTrack = scopeBind(playNextTrack, { scope: getClientScope()! });

    callPlayNextTrack();
  },

  onLoadedMetadata: (event: Event) => {
    const audioElement = event.currentTarget as HTMLAudioElement;
    const callSetVolume = scopeBind(setVolume, { scope: getClientScope()! });

    callSetVolume(audioElement.volume * 100);
  },

  onPlay: () => {
    const callSetIsPlaying = scopeBind(setMediaStatus, {
      scope: getClientScope()!,
    });

    callSetIsPlaying(MEDIA_STATUS.PLAYING);
  },

  onPlaying: () => {
    const callSetIsPlaying = scopeBind(setMediaStatus, {
      scope: getClientScope()!,
    });

    callSetIsPlaying(MEDIA_STATUS.PLAYING);
  },

  onPause: () => {
    const callSetIsPlaying = scopeBind(setMediaStatus, {
      scope: getClientScope()!,
    });

    callSetIsPlaying(MEDIA_STATUS.PAUSED);
  },

  onTimeUpdate: (event: Event) => {
    const audio = event.currentTarget as HTMLAudioElement;

    const callSetCurrentTime = scopeBind(setCurrentTime_, {
      scope: getClientScope()!,
    });

    callSetCurrentTime(audio.currentTime);
  },

  onVolumeChange: (event: Event) => {
    const audioElement = event.currentTarget as HTMLAudioElement;
    const callSetVolume = scopeBind(setVolume, { scope: getClientScope()! });

    callSetVolume(audioElement.volume * 100);
  },

  //-- furure section --/
  // onError: (_: Event) => {},
  // onAbort: (_: Event) => {},
  // onSeeked: (_: Event) => {},
  // onCanPlay: (_: Event) => {},
  // onSeeking: (_: Event) => {},
  // onStalled: (_: Event) => {},
  // onEmptied: (_: Event) => {},
  // onSuspend: (_: Event) => {},
  // onWaiting: (_: Event) => {},
  // onProgress: (_: Event) => {},
  // onLoadStart: (_: Event) => {},
  // onLoadedData: (_: Event) => {},
  // onRateChange: (_: Event) => {},
  // onCanPlayThrough: (_: Event) => {},
};

const createAudioElement = (context: AudioContext, destination: GainNode, track: Track) => {
  const audio = new Audio();

  audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`;
  audio.autoplay = true;
  audio.controls = false;

  // abort Событие вызывается , когда ресурс не был полностью загружен, но не в результате ошибки.
  // audio.addEventListener("abort", Emitter.onAbort);

  // canplay Событие вызывается , когда агент пользователя может играть средства массовой информации, но, по оценкам, что не достаточно данных были загружены, чтобы играть средства массовой информации до его конца без остановки для дальнейшей буферизации контента.
  // audio.addEventListener("canplay", Emitter.onCanPlay);

  // canplaythrough Событие вызывается , когда агент пользователя может играть средства массовой информации, и оценки , которые были загружены достаточно данных для воспроизведения медиа до его конца без остановки для дальнейшей буферизации контента.
  // audio.addEventListener("canplaythrough", Emitter.onCanPlayThrough);

  // durationchange Событие вызывается , когда duration атрибут был обновлен.
  audio.addEventListener("durationchange", Emitter.onDurationChange);

  // emptied Событие вызывается , когда среда становится пустой; например, это событие отправляется, если носитель уже был загружен (или частично загружен) и load()вызывается метод для его перезагрузки.
  // audio.addEventListener("emptied", Emitter.onEmptied);

  // ended Событие вызывается , когда воспроизведение или потоковое остановилось , потому что достигнут конец массовой информации или потому , что нет дополнительных данных не имеется.
  audio.addEventListener("ended", Emitter.onEnded);

  // error Событие вызывается , когда ресурс не может быть загружен из - за ошибки (например, проблемы подключения к сети).
  // audio.addEventListener("error", Emitter.onError);

  // loadeddata Событие вызывается , когда кадр в текущей позиции воспроизведения средств массовой информации по окончанию загрузки; часто первый кадр.
  // audio.addEventListener("loadeddata", Emitter.onLoadedData);

  // loadedmetadata Событие вызывается , когда метаданные были загружены.
  audio.addEventListener("loadedmetadata", Emitter.onLoadedMetadata);

  // loadstart Событие вызывается , когда браузер начал загружать ресурс.
  // audio.addEventListener("loadstart", Emitter.onLoadStart);

  // pause Событие отправляется , когда запрос приостановить деятельность осуществляется и деятельность вошла в приостановленное состояние, чаще всего после того, как в средствах массовой информации было приостановлено через вызов элемента pause()метода.
  audio.addEventListener("pause", Emitter.onPause);

  // play Событие вызывается , когда paused свойство изменяется от true до false, в результате play метода, или autoplay атрибута.
  audio.addEventListener("play", Emitter.onPlay);

  // playing Событие вызывается после того, как воспроизведение первым начало, и всякий раз , когда он будет перезапущен. Например, он срабатывает, когда воспроизведение возобновляется после паузы или задержки из-за отсутствия данных.
  audio.addEventListener("playing", Emitter.onPlaying);

  // progress Событие вызывается периодически как браузер загружает ресурс.
  // audio.addEventListener("progress", Emitter.onProgress);

  // ratechange Событие вызывается , когда скорость воспроизведения изменилась.
  // audio.addEventListener("ratechange", Emitter.onRateChange);

  // seeked Событие вызывается , когда операция поиска завершена, текущая позиция воспроизведения изменилась, и булево seekingатрибут изменено false.
  // audio.addEventListener("seeked", Emitter.onSeeked);

  // seeking Событие вызывается , когда начинаются искать операции, то есть булева seekingатрибут изменен trueи СМИ ищут новую позицию.
  // audio.addEventListener("seeking", Emitter.onSeeking);

  // stalled Событие вызывается , когда агент пользователя пытается получать мультимедийные данные, но данные неожиданно не последовало.
  // audio.addEventListener("stalled", Emitter.onStalled);

  // suspend Событие вызывается при загрузке мультимедийных данных было приостановлено.
  // audio.addEventListener("suspend", Emitter.onSuspend);

  // timeupdate Событие вызывается , когда время , указанное в currentTimeатрибуте было обновлено.
  audio.addEventListener("timeupdate", Emitter.onTimeUpdate);

  // volumechange Событие вызывается , когда объем изменился.
  audio.addEventListener("volumechange", Emitter.onVolumeChange);

  // waiting Событие вызывается , когда воспроизведение остановлено из - за временного отсутствия данных.
  // audio.addEventListener("waiting", Emitter.onWaiting);

  const _source = context.createMediaElementSource(audio);

  _source.connect(destination);
  return {
    _audio: audio,
    _source,
  };
};

const createWinampFx = createEffect<Track, Nullable<MediaElement>, Error>((track) => {
  const _context = new (window.AudioContext || window.webkitAudioContext)();
  const _staticSource = _context.createGain();
  const _balance = StereoBalanceNode(_context) as GainNode & StereoBalanceNodeType;

  const _preamp = _context.createGain();

  const _analyser = _context.createAnalyser();

  _analyser.fftSize = 2048;
  _analyser.smoothingTimeConstant = 0.0;
  const _gainNode = _context.createGain();

  const { _audio, _source } = createAudioElement(_context, _staticSource, track);

  _staticSource.connect(_preamp);

  let output = _preamp;

  const _bands: { [key in Band]: BiquadFilterNode } = {} as { [key in Band]: BiquadFilterNode };

  BANDS.forEach((band, i) => {
    const filter = _context.createBiquadFilter();

    _bands[band] = filter;

    // The first filter, includes all lower frequencies
    if (i === 0) {
      filter.type = "lowshelf";

      // The last filter, includes all higher frequencies
    } else if (i === BANDS.length - 1) {
      filter.type = "highshelf";
    } else {
      filter.type = "peaking";
    }
    filter.frequency.value = band;
    filter.gain.value = 0;

    output.connect(filter);
    output = filter;
  });

  output.connect(_balance);

  _balance.connect(_gainNode);
  _balance.connect(_analyser);
  _gainNode.connect(_context.destination);

  return {
    _context,
    _staticSource,
    _audio,
    _source,
    _balance,
    _preamp,
    _bands,
    _gainNode,
    _analyser,
  };
});

const initWinamp = createEvent();
const destroyWinamp = createEvent();
const closeWinamp = createEvent();

//function has load track in Media._audio
const loadUrl = createEvent<Track>();

const changeWindowState = createEvent<WinampWindow>();
const toggleShadePlayer = createEvent();
const minimizedWinamp = createEvent();
const showWinamp = createEvent();

const setMediaStatus = createEvent<MediaStatus>();

const selectTrackFromList = createEvent<Track>();

export const removeTrackFromPlaylist = createEvent<number>();

export const playAllTracksFromList = createEvent();

export const playNextTrack = createEvent();
export const onPlayClicked = createEvent();
export const onPauseClicked = createEvent();
export const onStopButtonClicked = createEvent();
export const nextTrackClicked = createEvent();
export const prevTrackClicked = createEvent();

const toggleLoop = createEvent();
const toggleShuffle = createEvent();

const changeClutterBar = createEvent<string>();

const toggleEnabledMarqueInfo = createEvent();
const enabledMarqueInfo = createEvent();
const disabledMarqueInfo = createEvent();

export const setMarqueInfo = createEvent<string | number>();

// volume segment //
export const setVolume = createEvent<number>();

// end volume segment //

// progress segment //

export const toggleTimeMode = createEvent();
export const setDuration = createEvent<number>();

/**
 * set current time from emitter
 */
export const setCurrentTime_ = createEvent<number>();

// end segment //

export const $mediaElement = createStore<Nullable<MediaElement>>(null);
const $currentTrack = createStore<Nullable<Track>>(null);

const $currentTrackIsEmpty = $currentTrack.map((track) => track === null);
const $activeWindow = createStore<WinampWindow>(WINAMP_WINDOW_STATE.NONE);

const $clutterBar = createStore<Record<string, boolean>>({
  o: false,
  a: false,
  i: false,
  d: false,
  v: false,
});

const $enabledMaruqeInfo = createStore<boolean>(false);
const $winampMarqueInfo = createStore<Nullable<string>>("");

const $loop = createStore<boolean>(false);

export const $shuffled = createStore<boolean>(false);

export const $winampState = createStore<TWinampState>(WINAMP_STATE.DESTROYED);

export const $mediaStatus = createStore<MediaStatus>(MEDIA_STATUS.STOPPED);

const $visiblePlayer = createStore<boolean>(false);
const $shadePlayer = createStore<boolean>(false);

export const $baseSkinColors = createStore<string[]>(baseSkinColors);

// volume segment //
export const $volume = createStore<number>(50);

// end volume segment //

// progress segment //
export const $timeMode = createStore<TimeMode>(TimeMode.ELAPSED);
export const $currentTrackDuration = createStore<number>(0);
export const $currentTrackTime = createStore<number>(0);
export const $timer = createStore<TrackTimer>({
  firstSecond: 0,
  lastSecond: 0,
  firstMinute: 0,
  lastMinute: 0,
});

/* remaining time in current Track */
export const $currentTrackTimeRemaining = createStore<number>(0);

// end progress segment //

/* effect changed volume from key pressed */
export const keyboardChangedVolumeFx = attach({
  source: $mediaElement,
  effect(media: Nullable<MediaElement>, event: KeyboardEvent) {
    if (media) {
      const volumeChange = event.key === "ArrowUp" ? 0.01 : -0.01;

      media._audio.volume += volumeChange;
    }
  },
});

/* effect changed volume in MediaElement */
export const changeVolumeFx = attach({
  source: $mediaElement,
  async effect(media: Nullable<MediaElement>, value: number | string) {
    if (media) {
      media._audio.volume = Number(value) / 100;
    }
  },
});

/* effect changed current time in MediaElement */
export const changeCurrentTimeFx = attach({
  source: $mediaElement,
  async effect(
    media: Nullable<MediaElement>,
    { newTime, allowSeeking }: { newTime: number; allowSeeking: boolean },
  ) {
    if (media && allowSeeking) {
      media._audio.currentTime = newTime;
    }
  },
});

/* effect changed current time in MediaElement when key pressed */
export const keyChangeCurrentTimeFx = attach({
  source: $mediaElement,
  async effect(media: Nullable<MediaElement>, { direction }: { direction: TimeDirection }) {
    if (media && direction === "forward") {
      media._audio.currentTime += 5;
    }

    if (media && direction === "backward") {
      media._audio.currentTime -= 5;
    }
  },
});

const baseFx = attach({
  source: $mediaElement,
  async effect(media, callback: EffectCallback) {
    if (media) {
      callback(media);
    }
  },
});

const stopPlayingFx = attach({
  effect: baseFx,
  mapParams: () => stopPlayingCb,
});

const toggleLoopFx = attach({
  source: $mediaElement,
  async effect(media, { loop }) {
    if (media) {
      media._audio.loop = loop;
    }
  },
});

const toggleShuffleFx = attach({
  effect: toggleLoopFx,
  mapParams: () => ({ loop: false }),
});

const startPlayFromBegginingFx = attach({
  effect: baseFx,
  mapParams: () => startPlayFromBegginingCb,
});

export const startPlayingFx = attach({
  effect: baseFx,
  mapParams: () => startPlayingCb,
});

/* normalize naming please */
const pausePlayingFx = attach({
  effect: baseFx,
  mapParams: () => pausePlayingCb,
});

export const playNextTrackIsOneInPlayListFx = attach({
  effect: baseFx,
  mapParams: () => playNextTrackIsOneInPlayListCb,
});

export const toggleEQFx = attach({
  source: $mediaElement,
  async effect(media, { enable }: { enable: boolean }) {
    if (media) {
      const connectionSource = enable ? media._preamp : media._balance;

      media._staticSource.disconnect();
      media._staticSource.connect(connectionSource);
    }
  },
});

export const resetEqBandFx = attach({
  source: $mediaElement,
  async effect(media, { name }: { name: string }) {
    const bandName = Number(name) as keyof _Bands;

    media!._bands[bandName].gain.value = 0;

    return { [bandName]: 50 } as Record<Band, number>;
  },
});

export const setEQbandFx = attach({
  source: $mediaElement,
  async effect(media, { name, value }: { name: string; value: string | number }) {
    const snapBandValue = getSnapBandValue(Number(value));

    const bandName = Number(name) as keyof _Bands;
    const db = snapBandValue * 0.24 - 12;

    media!._bands[bandName].gain.value = db;

    return { [bandName]: snapBandValue } as Record<Band, number>;
  },
});

export const changePreampFx = attach({
  source: $mediaElement,
  async effect(media, { value }: { value: number }) {
    const db = value * 0.24 - 12;

    media!._preamp.gain.value = Math.pow(10, db / 20);

    return value;
  },
});

export const setAllBandsEqFx = attach({
  source: $mediaElement,
  async effect(media, { key }: { key: "min" | "max" | "reset" }) {
    const dbValues = {
      max: 12,
      min: -12,
      reset: 0,
    };

    const db = dbValues[key] || 0;

    for (const [, band] of Object.entries(media!._bands)) {
      band.gain.value = db;
    }

    return key;
  },
});

export const loadPresetEQFx = attach({
  source: $mediaElement,
  async effect(media, { preset }: { preset: TPreset }) {
    Object.entries(preset.value).forEach(([key, value]) => {
      const bandName = Number(key) as keyof _Bands;
      const db = value * 0.24 - 12;

      media!._bands[bandName].gain.value = db;
    });
    return preset.value;
  },
});

// runtime //

export const $isPlaying = $mediaStatus.map((status) => status === MEDIA_STATUS.PLAYING);
export const $isStopped = $mediaStatus.map((status) => status === MEDIA_STATUS.STOPPED);
export const $isPaused = $mediaStatus.map((status) => status === MEDIA_STATUS.PAUSED);

// runtime volume segment //
$volume.on(setVolume, (_, volume) => volume);

// end segment //

// runtime progress segment //

$timeMode.on(toggleTimeMode, (timeMode) =>
  timeMode === TimeMode.ELAPSED ? TimeMode.REMAINING : TimeMode.ELAPSED,
);
$currentTrackDuration.on(setDuration, (_, duration) => duration);

// end segment //

/* ebat' kakoy sample */
sample({
  clock: destroyWinamp,
  source: $mediaElement,
  filter: (mediaSource, _): mediaSource is MediaElement =>
    mediaSource!._audio instanceof HTMLAudioElement,

  target: createEffect<MediaElement, void>((media) => {
    const { _audio: audio } = media;

    // audio.removeEventListener("abort", Emitter.onAbort);
    // audio.removeEventListener("canplay", Emitter.onCanPlay);
    // audio.removeEventListener("canplaythrough", Emitter.onCanPlayThrough);
    audio.removeEventListener("durationchange", Emitter.onDurationChange);

    // audio.removeEventListener("emptied", Emitter.onEmptied);
    audio.removeEventListener("ended", Emitter.onEnded);

    // audio.removeEventListener("error", Emitter.onError);
    // audio.removeEventListener("loadeddata", Emitter.onLoadedData);
    audio.removeEventListener("loadedmetadata", Emitter.onLoadedMetadata);

    // audio.removeEventListener("loadstart", Emitter.onLoadStart);
    audio.removeEventListener("pause", Emitter.onPause);
    audio.removeEventListener("play", Emitter.onPlay);
    audio.removeEventListener("playing", Emitter.onPlaying);

    // audio.removeEventListener("progress", Emitter.onProgress);
    // audio.removeEventListener("ratechange", Emitter.onRateChange);
    // audio.removeEventListener("seeked", Emitter.onSeeked);
    // audio.removeEventListener("seeking", Emitter.onSeeking);
    // audio.removeEventListener("stalled", Emitter.onStalled);
    // audio.removeEventListener("suspend", Emitter.onSuspend);
    audio.removeEventListener("timeupdate", Emitter.onTimeUpdate);
    audio.removeEventListener("volumechange", Emitter.onVolumeChange);

    // audio.removeEventListener("waiting", Emitter.onWaiting);
    audio.pause();

    media._source.disconnect();
  }),
});

//initial $Media source

$mediaElement.on(createWinampFx.doneData, (_, media) => media);

$shadePlayer.on(toggleShadePlayer, toggle);

$winampState.on(initWinamp, () => WINAMP_STATE.INIT);

$mediaStatus.on(setMediaStatus, (_, status) => status);

$loop.on(toggleLoop, toggle);

sample({
  clock: loadUrl,
  source: $mediaElement,
  fn: (media, track) => ({ media, track }),
  target: loadUrlFx,
});

//toggle loop from ui
sample({
  clock: $loop,
  fn: (loop) => ({ loop }),
  target: toggleLoopFx,
});

$shuffled.on(toggleShuffle, toggle);

sample({
  clock: $shuffled,
  filter: $shuffled,
  target: toggleShuffleFx,
});

sample({
  clock: selectTrackFromList,
  target: loadUrl,
});

$winampState.on(selectTrackFromList, () => WINAMP_STATE.TRACKLOADED);

sample({
  clock: selectTrackFromList,
  source: $winampState,
  filter: (state) => state === WINAMP_STATE.INIT,
  fn: () => WINAMP_STATE.TRACKLOADED,
  target: $winampState,
});

$currentTrack.on(loadUrlFx.doneData, (_, track) => ({
  ...track,
}));

sample({
  clock: initWinamp,
  source: $currentTrack,
  filter: not($currentTrackIsEmpty),
  fn: (track) => track!,
  target: createWinampFx,
});

//Controls

//when press playbutton when status playing
sample({
  clock: onPlayClicked,
  filter: $isPlaying,
  target: startPlayFromBegginingFx,
});

//when press playbutton and status not playing
sample({
  clock: onPlayClicked,
  filter: not($isPlaying),
  target: startPlayingFx,
});

sample({
  clock: onPauseClicked,
  target: pausePlayingFx,
});

sample({
  clock: onStopButtonClicked,
  target: stopPlayingFx,
});

$mediaStatus.on([stopPlayingFx.done], () => MEDIA_STATUS.STOPPED);

// const delayedStopButtonClicked = delay({
//     source: onStopButtonClicked,
//     timeout: 300,
//     target: $mediaStatus,
// })

sample({
  clock: nextTrackClicked,
  target: playNextTrack,
});

//balance Control

/** ------------work with window winamp---------- */

//closing Winamp

sample({
  clock: closeWinamp,
  target: onStopButtonClicked,
});

$winampState.on(closeWinamp, () => WINAMP_STATE.CLOSED);

sample({
  clock: $winampState,
  filter: (state) =>
    state === WINAMP_STATE.CLOSED ||
    state === WINAMP_STATE.MINIMIZED ||
    state === WINAMP_STATE.DESTROYED,
  fn: () => false,
  target: $visiblePlayer,
});

sample({
  clock: $winampState,
  filter: (state) => state === WINAMP_STATE.OPENED || state === WINAMP_STATE.TRACKLOADED,
  fn: () => true,
  target: $visiblePlayer,
});

sample({
  clock: minimizedWinamp,
  fn: () => WINAMP_STATE.MINIMIZED,
  target: $winampState,
});

//winamp window active state

$activeWindow.on(changeWindowState, (_, currentWindow) => currentWindow);
$activeWindow.reset([closeWinamp, selectTrackFromList]);

/**
 * @todo refactor is a dich from here ==>
 */
sample({
  clock: showWinamp,
  filter: $currentTrackIsEmpty,
  fn: () => WINAMP_STATE.OPENED,
  target: $winampState,
});

sample({
  clock: showWinamp,
  filter: not($currentTrackIsEmpty),
  fn: () => WINAMP_STATE.TRACKLOADED,
  target: $winampState,
});

// <== to here

sample({
  clock: playAllTracksFromList,
  target: showWinamp,
});

sample({
  clock: playAllTracksFromList,
  filter: not($isPlaying),
  target: onPlayClicked,
});

$clutterBar.on(changeClutterBar, (keys, key) => {
  return { ...keys, [key]: !keys[key] };
});

$enabledMaruqeInfo.on(toggleEnabledMarqueInfo, toggle);
$enabledMaruqeInfo.on(enabledMarqueInfo, () => true);
$enabledMaruqeInfo.on(disabledMarqueInfo, () => false);

$winampMarqueInfo.on(setMarqueInfo, (_, payload) => String(payload));
$winampMarqueInfo.reset([disabledMarqueInfo, $enabledMaruqeInfo]);

sample({
  clock: $currentTrackTime,
  source: $currentTrackDuration,
  fn: (duration, currentTime) => duration - currentTime,
  target: $currentTrackTimeRemaining,
});

sample({
  clock: $currentTrackTime,
  source: $timeMode,
  filter: (timeMode) => timeMode === TimeMode.ELAPSED,
  fn: (_, currentTime) => getMMssFromNumber(currentTime),
  target: $timer,
});

sample({
  clock: $currentTrackTimeRemaining,
  source: $timeMode,
  filter: (timeMode) => timeMode === TimeMode.REMAINING,
  fn: (_, currentTime) => getMMssFromNumber(currentTime),
  target: $timer,
});

reset({
  clock: $currentTrack,
  target: [$timer, $currentTrackTimeRemaining, $currentTrackTime],
});

export const marqueInfo = {
  $winampMarqueInfo,
  $enabledMaruqeInfo,
  enabledMarqueInfo,
  disabledMarqueInfo,
  toggleEnabledMarqueInfo,
};

export const winampControls = {
  play: onPlayClicked,
  pause: onPauseClicked,
  stop: onStopButtonClicked,
  prevTrack: prevTrackClicked,
  nextTrack: nextTrackClicked,
  toggleShuffle,
  toggleLoop,
};

export const winamp = {
  init: initWinamp,
  destroy: destroyWinamp,
  close: closeWinamp,
  show: showWinamp,
  minimize: minimizedWinamp,

  $mediaStatus,
  $currentTrack,
  selectTrackFromList,
  playAllTracksFromList,
  toggleShadePlayer,
  $loop,
  $shuffle: $shuffled,
};

export const winampStates = {
  $winampState,

  $activeWindow,
  changeWindowState,
  $visiblePlayer,
  $shadePlayer,
};

export { loadUrl, selectTrackFromList, $clutterBar, changeClutterBar };
