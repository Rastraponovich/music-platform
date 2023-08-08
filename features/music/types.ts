import { MouseEventHandler } from "react";

import { Nullable } from "@/types";

import { Playlist } from "../playlist/types";

export enum PlayerState {
  STOPED = "STOPED",
  PLAYED = "PLAYED",
  PAUSED = "PAUSED",
  DESTROYED = "DESTROYED",
}

export enum TimeMode {
  ELAPSED = "ELAPSED",
  REMAINING = "REMAINING",
}

export type Song = {
  id?: number;
  name: string;
  artist: string;
  isActive: boolean;
  path: string;
  cover: string;
  likes: number;
  comments: unknown[];
  userId?: number;
  user?: unknown;
  metaData: {
    format: {
      tagTypes?: string[];
      trackInfo?: unknown[];
      lossless?: boolean;
      container?: string;
      codec?: string;
      tool?: string;
      sampleRate: number;
      numberOfChannels: number;
      numberOfSamples?: number;
      bitrate: number;
      codecProfile?: string;
      duration: number;
    };
    native: { [key: string]: { id: string; value: string }[] };
    quality: {
      warnings: {
        message: string;
      }[];
    };
    common: {
      track: { no: Nullable<number>; of: Nullable<number> };
      disk: { no: Nullable<number>; of: Nullable<number> };
      movementIndex?: unknown;
      encodersettings?: string;
    };
  };
  playerPlayListId?: string | null;
  playlists?: Playlist[];
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

export enum EAudioStates {
  HAVE_NOTHING = "HAVE_NOTHING",
  HAVE_METADATA = "HAVE_METADATA",
  HAVE_CURRENT_DATA = "HAVE_CURRENT_DATA",
  HAVE_FUTURE_DATA = "HAVE_FUTURE_DATA",
  HAVE_ENOUGH_DATA = "HAVE_ENOUGH_DATA",
}

export type TAudioStates = Record<string, EAudioStates>;

export const AUDIO_STATES: TAudioStates = {
  "0": EAudioStates.HAVE_NOTHING,
  "1": EAudioStates.HAVE_METADATA,
  "2": EAudioStates.HAVE_CURRENT_DATA,
  "3": EAudioStates.HAVE_FUTURE_DATA,
  "4": EAudioStates.HAVE_ENOUGH_DATA,
};

/**
 * wtf bro
 */
export type TVISUALIZERS = {
  OSCILLOSCOPE: "OSCILLOSCOPE";
  BAR: "BAR";
  NONE: "NONE";
  MILKDROP: "MILKDROP";
};

export type Band = 60 | 170 | 310 | 600 | 1000 | 3000 | 6000 | 12000 | 14000 | 16000;

export type TWinampState =
  | "DESTROYED"
  | "CREATED"
  | "INIT"
  | "TRACKLOADED"
  | "CLOSED"
  | "OPENED"
  | "MINIMIZED";

export type TMediaStatus = "PLAYING" | "STOPPED" | "PAUSED";

export type TWinampWindow = "PLAYER" | "EQUALIZER" | "PLAYLIST" | "NONE" | "PRESETS";

export type UseDraggblePosition = {
  clientX: string | number;
  clientY: string | number;
};
export type UseDraggbleReturnProps = [
  onDragStart: MouseEventHandler,
  onDragging: MouseEventHandler,
  onDragEnd: MouseEventHandler,
];

export interface Track extends Song {}

export interface StereoBalanceNodeType extends AudioNode {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(context: AudioContext): StereoBalanceNodeType;
  balance: {
    value: number;
  };
}

export type _Bands = { [key in Band]: BiquadFilterNode };

export type MediaElement = {
  _context: AudioContext;
  _staticSource: GainNode;
  _balance: StereoBalanceNodeType;
  _preamp: GainNode;
  _analyser: AnalyserNode;
  _gainNode: GainNode;
  _audio: HTMLAudioElement;
  _source: MediaElementAudioSourceNode;
  _bands: _Bands;
};

export type TPreset = {
  name: PresetTypes;
  value: Record<Band, number>;
};

export type PresetTypes =
  | "ROCK"
  | "DEFAULT"
  | "TECHNO"
  | "CLASSIC"
  | "CLUB"
  | "FULL BASS"
  | "FULL BASS AND TREBBLE";
