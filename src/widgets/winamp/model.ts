import { debug, not, reset } from "patronum";
import { sample, createEffect, createEvent, createStore, scopeBind, attach } from "effector";

import { StereoBalanceNode } from "~/shared/lib/audio/stereo-balance-node";

import { getClientScope } from "@/src/shared/hooks/use-scope";

import type { Nullable } from "@/types";

import { baseSkinColors } from "@/types/ui.types";
import { $songs } from "../../../features/music";
import {
  BANDS,
  MEDIA_STATUS,
  WINAMP_STATE,
  WINAMP_WINDOW_STATE,
} from "../../../features/music/constants";
import {
  Band,
  Track,
  TWinampState,
  TWinampWindow,
  MediaElement,
  StereoBalanceNodeType,
  TMediaStatus,
  TimeMode,
} from "../../../features/music/types";
import { createWinampPlaylistFactory } from "../../../features/music/winamp-playlist";
import { createWinampEQFactory } from "../../../features/music/winamp-eq";

import { getMMssFromNumber, getSnapBandValue, toggle } from "@/utils/utils";

import { generateRandomId } from "./utils";
declare global {
  interface Window {
    webkitAudioContext: {
      new (contextOptions?: AudioContextOptions | undefined): AudioContext;
      prototype: AudioContext;
    };
  }
}

/**
 * @todo export
 */
type TrackTimer = {
  firstSecond: number;
  lastSecond: number;
  lastMinute: number;
  firstMinute: number;
};

const startPlayFromBegginingFx = createEffect<{ media: Nullable<MediaElement> }, void>(
  ({ media }) => {
    if (media) {
      media._audio.currentTime = 0;
    }
  },
);

const startPlayingFx = createEffect<{ media: Nullable<MediaElement> }, void>(({ media }) => {
  if (media) {
    media._audio.play();
  }
});

const pausePlayingFx = createEffect<{ media: Nullable<MediaElement> }, void>(({ media }) => {
  if (media) {
    media._audio.pause();
  }
});

const stopPlayingFx = createEffect<{ media: Nullable<MediaElement> }, void>(({ media }) => {
  if (media) {
    media._audio.pause();
    media._audio.currentTime = 0;
  }
});

const loadUrlFx = createEffect<{ media: Nullable<MediaElement>; track: Track }, Track>(
  ({ media, track }) => {
    if (media) {
      media._audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`;
    }

    return track;
  },
);

const toggleLoopFx = createEffect<{ media: Nullable<MediaElement>; loop: boolean }, void>(
  ({ media, loop }) => {
    if (media) {
      media._audio.loop = loop;
    }
  },
);

const toggleShuffleFx = createEffect<{ media: Nullable<MediaElement> }, void>(({ media }) => {
  if (media) {
    media._audio.loop = false;
  }
});

const playNextTrackIsOneInPlayListFx = createEffect<{ audio: HTMLAudioElement }, void>(
  ({ audio }) => {
    audio.currentTime = 0;
    audio.play();
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

const changeWindowState = createEvent<TWinampWindow>();
const toggleShadePlayer = createEvent();
const minimizedWinamp = createEvent();
const showWinamp = createEvent();

const setMediaStatus = createEvent<TMediaStatus>();

const selectTrackFromList = createEvent<Track>();
const removeTrackFromPlaylist = createEvent<number>();
const playAllTracksFromList = createEvent();

const playNextTrack = createEvent();
const onPlayClicked = createEvent();
const onPauseClicked = createEvent();
const onStopButtonClicked = createEvent();
const nextTrackClicked = createEvent();
const prevTrackClicked = createEvent();

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

const $Media = createStore<Nullable<MediaElement>>(null);
const $currentTrack = createStore<Nullable<Track>>(null);
const $activeWindow = createStore<TWinampWindow>(WINAMP_WINDOW_STATE.NONE);

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
const $shuffled = createStore<boolean>(false);

const $winampState = createStore<TWinampState>(WINAMP_STATE.DESTROYED);
const $mediaStatus = createStore<TMediaStatus>(MEDIA_STATUS.STOPPED);

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

/**
 * remaining time in current Track
 */
export const $currentTrackTimeRemaining = createStore<number>(0);

// end progress segment //

/**
 * when volume changed from key pressed
 */
export const keyboardChangedVolumeFx = attach({
  source: $Media,
  effect(media: Nullable<MediaElement>, key: "up" | "down") {
    if (media) {
      const volumeChange = key === "up" ? 0.01 : -0.01;

      media._audio.volume += volumeChange;
    }
  },
});

/**
 * change volume
 */
export const changeVolumeFx = attach({
  source: $Media,
  async effect(media: Nullable<MediaElement>, value: number | string) {
    if (media) {
      media._audio.volume = Number(value) / 100;
    }
  },
});

/**
 * @todo for feature
 */
export const changeCurrentTimeFx = attach({
  source: $Media,
  async effect(
    media: Nullable<MediaElement>,
    { newTime, allowSeeking }: { newTime: number; allowSeeking: boolean },
  ) {
    if (media && allowSeeking) {
      media._audio.currentTime = newTime;
    }
  },
});

/**
 * @todo for feature
 */
export const keyChangeCurrentTimeFx = attach({
  source: $Media,
  async effect(
    media: Nullable<MediaElement>,
    { direction }: { direction: "forward" | "backward" | string },
  ) {
    if (media) {
      if (direction === "forward") {
        media._audio.currentTime = media._audio.currentTime + 5;
      }

      if (direction === "backward") {
        media._audio.currentTime = media._audio.currentTime - 5;
      }
    }
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

sample({
  clock: destroyWinamp,
  source: $Media,
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

$Media.on(createWinampFx.doneData, (_, media) => media);

$shadePlayer.on(toggleShadePlayer, toggle);

$winampState.on(initWinamp, () => WINAMP_STATE.INIT);

$mediaStatus.on(setMediaStatus, (_, status) => status);

$loop.on(toggleLoop, toggle);

sample({
  clock: loadUrl,
  source: $Media,
  fn: (media, track) => ({ media, track }),
  target: loadUrlFx,
});

//toggle loop from ui
sample({
  clock: $loop,
  source: $Media,
  filter: (media) => media?._audio instanceof HTMLAudioElement,
  fn: (media, loop) => ({ media, loop }),
  target: toggleLoopFx,
});

$shuffled.on(toggleShuffle, toggle);

sample({
  clock: $shuffled,
  source: $Media,
  filter: $shuffled,
  fn: (media) => ({ media }),
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
  filter: (track) => !!track,
  fn: (track) => track!,
  target: createWinampFx,
});

const {
  toggleVisibleEQ,
  toggleAutoEQ,
  enableClickedEQ,
  toggleMinimizeEQ,
  resetEqBand,
  disableClickedEQ,
  changePreampValue,
  changeEQBand,
  changeAllBandsValues,
  $visibleEQ,
  $preamp,
  $minimizedEQ,
  $enabledEQ,
  $bands,
  $autoEQ,
  loadPreset,
  $presets,
  $currentPreset,
  $selectedPreset,
  $visiblePresetWindow,
  selectPreset,
  toggleVisiblePresetWindow,
} = createWinampEQFactory($Media);

const {
  $playlist,
  addTrackToPlaylist,
  $playlistLength,
  $selectedTrackInPlaylist,
  selectTrackInPlaylist,
  doubleClickedTrackInPlaylist,
  $currentPlayedTrackIndex,
  setCurrentPlayedTrackIndex,
  $durationTracksInPlaylist,
  $visiblePlaylist,
  toggleVisiblePlaylist,
} = createWinampPlaylistFactory();

$playlist.on(selectTrackFromList, (_, track) => [track]);

$playlist.on(removeTrackFromPlaylist, (tracks, id) => tracks.filter((_, index) => index !== id));

$selectedTrackInPlaylist.reset(removeTrackFromPlaylist);

$currentPlayedTrackIndex.on(selectTrackFromList, () => 0);

sample({
  clock: removeTrackFromPlaylist,
  source: $currentPlayedTrackIndex,
  filter: (currentIndex, removedIndex) => {
    if (currentIndex && currentIndex > removedIndex) return true;
    return false;
  },
  fn: (currentIndex) => currentIndex! - 1,
  target: $currentPlayedTrackIndex,
});

sample({
  clock: $currentPlayedTrackIndex,
  source: $playlist,
  filter: (_, id) => id !== null,
  fn: (playlist, id) => playlist[id!],
  target: $currentTrack,
});

//when track ended check next track in playlist exists
// checking playlist is emtpy state
const checkPlayNextTrack = sample({
  clock: playNextTrack,
  source: $playlistLength,
  filter: (playlistLength) => playlistLength > 0,
});

const checkPlayNextTrackNoShuffle = sample({
  clock: checkPlayNextTrack,
  source: $shuffled,

  //experemental
  filter: not($shuffled),
});

//when playlist is not empty check currentTrackIndex in playlist if not last put next, otherwise put first
const playNextTrackNoShuffle = sample({
  clock: checkPlayNextTrackNoShuffle,
  source: { currentPlayedTrackIndex: $currentPlayedTrackIndex, playlistLength: $playlistLength },

  fn: ({ currentPlayedTrackIndex, playlistLength }) => {
    const lastTrack = currentPlayedTrackIndex === playlistLength! - 1;

    if (lastTrack) return 0;
    return currentPlayedTrackIndex! + 1;
  },
});

//set new Track index in currentPlayedTrackIndexPlaylist
sample({
  clock: playNextTrackNoShuffle,
  fn: (newTrackIndex) => newTrackIndex,
  target: $currentPlayedTrackIndex,
});

// when Shuffle is ON
const checkPlayNextTrackShuffled = sample({
  clock: checkPlayNextTrack,
  source: $shuffled,

  //experemental
  filter: $shuffled,
});

const isOneTrackInPlayList = sample({
  clock: checkPlayNextTrackShuffled,
  source: $playlistLength,
  filter: (playListLength) => playListLength === 1,
});

const isBiggerOneTrackInPlayList = sample({
  clock: checkPlayNextTrackShuffled,
  source: $playlistLength,
  filter: (playListLength) => playListLength > 1,
});

sample({
  clock: isOneTrackInPlayList,
  source: $Media,
  fn: (media) => ({ audio: media!._audio }),
  target: playNextTrackIsOneInPlayListFx,
});

sample({
  clock: isBiggerOneTrackInPlayList,
  source: { playlistLength: $playlistLength, currentPlayedTrackIndex: $currentPlayedTrackIndex },
  fn: ({ playlistLength, currentPlayedTrackIndex }) => {
    if (currentPlayedTrackIndex) {
      return generateRandomId(playlistLength, currentPlayedTrackIndex);
    }

    return 0;
  },
  target: $currentPlayedTrackIndex,
});

//setting new Track in CurrentTrack
sample({
  clock: $currentPlayedTrackIndex,
  source: $playlist,
  filter: (_, newTrackIndex) => newTrackIndex !== null,
  fn: (playlist, newTrackIndex) => playlist[newTrackIndex as number],
  target: loadUrl,
});

//Controls

//when press playbutton when status playing
sample({
  clock: onPlayClicked,
  source: { media: $Media },
  filter: $isPlaying,
  target: startPlayFromBegginingFx,
});

//when press playbutton and status not playing
sample({
  clock: onPlayClicked,
  source: { media: $Media },
  filter: not($isPlaying),
  target: startPlayingFx,
});

sample({
  clock: onPauseClicked,
  source: { media: $Media },
  filter: ({ media }) => !!media,
  target: pausePlayingFx,
});

sample({
  clock: onStopButtonClicked,
  source: { media: $Media },
  target: stopPlayingFx,
});

$mediaStatus.on([stopPlayingFx.done, doubleClickedTrackInPlaylist], () => MEDIA_STATUS.STOPPED);

// const delayedStopButtonClicked = delay({
//     source: onStopButtonClicked,
//     timeout: 300,
//     target: $mediaStatus,
// })

sample({
  clock: doubleClickedTrackInPlaylist,
  source: { media: $Media },
  target: startPlayingFx,
});

sample({
  clock: nextTrackClicked,
  target: playNextTrack,
});

const checkPrevTrackClicked = sample({
  clock: prevTrackClicked,
  source: $playlistLength,
  filter: (playListLength) => playListLength > 0,
});

const playPrevTrackNoShuffle = sample({
  clock: checkPrevTrackClicked,
  source: $shuffled,

  //experemental
  filter: not($shuffled),
});

/**
 * somthing in logic wrong. need to deep testing
 */
sample({
  clock: playPrevTrackNoShuffle,
  source: { playlist: $playlist, currentPlayedTrackIndex: $currentPlayedTrackIndex },
  fn: ({ playlist, currentPlayedTrackIndex }) => {
    if (currentPlayedTrackIndex === 0) return playlist.length - 1;

    return currentPlayedTrackIndex! - 1;
  },
  target: setCurrentPlayedTrackIndex,
});

const checkPlayPrevTrackShuffled = sample({
  clock: checkPrevTrackClicked,
  source: $shuffled,
  filter: (shuffle) => shuffle,
});

sample({
  clock: checkPlayPrevTrackShuffled,
  source: { playlistLength: $playlistLength, currentPlayedTrackIndex: $currentPlayedTrackIndex },
  fn: ({ playlistLength, currentPlayedTrackIndex }) => {
    return generateRandomId(playlistLength, currentPlayedTrackIndex!);
  },
  target: setCurrentPlayedTrackIndex,
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
  target: [$visibleEQ, $visiblePlayer, $visiblePlaylist],
});

sample({
  clock: $winampState,
  filter: (state) => state === WINAMP_STATE.OPENED || state === WINAMP_STATE.TRACKLOADED,
  fn: () => true,
  target: [$visibleEQ, $visiblePlayer, $visiblePlaylist],
});

sample({
  clock: minimizedWinamp,
  fn: () => WINAMP_STATE.MINIMIZED,
  target: $winampState,
});

//winamp window active state

$activeWindow.on(changeWindowState, (_, currentWindow) => currentWindow);
$activeWindow.reset([closeWinamp, selectTrackFromList]);

sample({
  clock: showWinamp,
  source: $currentTrack,
  filter: (currentTrack) => currentTrack === null,
  fn: () => WINAMP_STATE.OPENED,
  target: $winampState,
});

sample({
  clock: showWinamp,
  source: $currentTrack,
  filter: (currentTrack) => currentTrack !== null,
  fn: () => WINAMP_STATE.TRACKLOADED,
  target: $winampState,
});

sample({
  clock: playAllTracksFromList,
  source: $songs,
  fn: (songs) => [...songs],
  target: $playlist,
});

sample({
  clock: playAllTracksFromList,
  fn: () => 0,
  target: $currentPlayedTrackIndex,
});

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
  clock: changeEQBand,
  fn: (event) => {
    const snapBandValue = getSnapBandValue(Number(event.target.value));
    const db = (snapBandValue / 100) * 24 - 12;

    return `EQ: ${event.target.name}HZ ${db.toFixed(1)} DB`;
  },
  target: setMarqueInfo,
});

sample({
  clock: changePreampValue,
  fn: (event) => {
    const snapBandValue = getSnapBandValue(Number(event.target.value));
    const db = (snapBandValue / 100) * 24 - 12;

    return `EQ: PREAMP ${db.toFixed(1)} DB`;
  },
  target: setMarqueInfo,
});

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

export const playlist = {
  doubleClick: doubleClickedTrackInPlaylist,
  $playlistLength,
  $playlist,
  $selectedTrackInPlayList: $selectedTrackInPlaylist,
  selectTrackInPlaylist,
  $currentPlayedTrackIndex,
  addTrackToPlaylist,
  $visiblePlaylist,
  toggleVisiblePlaylist,
  removeTrackFromPlaylist,
};

export const duration = {
  $durationTracksInPlaylist,
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

export const eq = {
  changeAllBandsValues,
  changePreampValue,
  changeEQBand,
  disableClickedEQ,
  enableClickedEQ,
  resetEqBand,
  $auto: $autoEQ,
  $enabled: $enabledEQ,
  $preamp,
  $bands,
  $visibleEQ,
  toggleVisibleEQ,
  toggleAutoEQ,
  $presets,
  loadPreset,
  $currentPreset,
  $selectedPreset,
  $visiblePresetWindow,
  selectPreset,
  toggleVisiblePresetWindow,
  $minimized: $minimizedEQ,
  toggleMinimized: toggleMinimizeEQ,
};

export { loadUrl, selectTrackFromList, $Media, $clutterBar, changeClutterBar };
