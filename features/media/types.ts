/* eslint-disable lines-around-comment */
export interface Point {
  x: number;
  y: number;
}

export interface Diff {
  x?: number;
  y?: number;
}

export interface BoundingBox {
  width: number;
  height: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

export interface FilePicker {
  contextMenuName: string;
  filePicker: () => Promise<Track[]>;
  requiresNetwork: boolean;
}

export type Skin = {
  url: string;
  name: string;
};

export interface MilkdropMessage {
  text: string;
  time: number;
}

export type Band = 60 | 170 | 310 | 600 | 1000 | 3000 | 6000 | 12000 | 14000 | 16000;

export type Slider = Band | "preamp";

export type CursorImage =
  | {
      type: "cur";
      url: string;
    }
  | {
      type: "ani";
      aniData: Uint8Array;
    };

// TODO: Use a type to ensure these keys mirror the CURSORS constant in
// skinParser.js
export type Cursors = { [cursor: string]: CursorImage };

export type GenLetterWidths = { [letter: string]: number };

export interface PlaylistStyle {
  normal: string;
  current: string;
  normalbg: string;
  selectedbg: string;
  font: string;
}

// TODO: Type these keys.
export type SkinImages = { [sprite: string]: string };

// TODO: type these keys
export type SkinRegion = { [windowName: string]: string[] };

export interface SkinGenExColors {
  itemBackground: string;
  itemForeground: string;
  windowBackground: string;
  buttonText: string;
  windowText: string;
  divider: string;
  playlistSelection: string;
  listHeaderBackground: string;
  listHeaderText: string;
  listHeaderFrameTopAndLeft: string;
  listHeaderFrameBottomAndRight: string;
  listHeaderFramePressed: string;
  listHeaderDeadArea: string;
  scrollbarOne: string;
  scrollbarTwo: string;
  pressedScrollbarOne: string;
  pressedScrollbarTwo: string;
  scrollbarDeadArea: string;
  listTextHighlighted: string;
  listTextHighlightedBackground: string;
  listTextSelected: string;
  listTextSelectedBackground: string;
}

export type WindowId = string;

// TODO: Fill these out once we actually use them.
export type SkinData = {
  skinImages: SkinImages;
  skinColors: string[];
  skinPlaylistStyle: PlaylistStyle;
  skinCursors: Cursors;
  skinRegion: SkinRegion;
  skinGenLetterWidths: GenLetterWidths;
  skinGenExColors: SkinGenExColors | null;
};

// This is what we actually pass to butterchurn
type ButterchurnPresetJson = {
  name: string;
  butterchurnPresetObject: object;
};

// A URL that points to a Butterchurn preset
interface ButterchurnPresetUrl {
  name: string;
  butterchurnPresetUrl: string;
}

export type LazyButterchurnPresetJson = {
  name: string;
  getButterchrunPresetObject: () => Promise<object>;
};

export type Preset = ButterchurnPresetJson | ButterchurnPresetUrl | LazyButterchurnPresetJson;

export type StatePreset =
  | { type: "RESOLVED"; name: string; preset: object }
  | { type: "UNRESOLVED"; name: string; getPreset: () => Promise<object> };

export interface ButterchurnOptions {
  getPresets(): Promise<Preset[]>;
  importButterchurn(): Promise<unknown>;
  importConvertPreset?: () => Promise<{
    convertPreset(file: string, endpoint: string): Promise<object>;
  }>;
  presetConverterEndpoint?: string;
  butterchurnOpen: boolean;
}

export interface EqfPreset {
  name: string;
  hz60: number;
  hz170: number;
  hz310: number;
  hz600: number;
  hz1000: number;
  hz3000: number;
  hz12000: number;
  hz14000: number;
  hz16000: number;
  hz6000: number;
  preamp: number;
}

export enum TransitionType {
  IMMEDIATE,
  DEFAULT,
  USER_PRESET,
}

export interface Size {
  width: number;
  height: number;
}

export type MediaTagRequestStatus = "INITIALIZED" | "FAILED" | "COMPLETE" | "NOT_REQUESTED";

export type MediaStatus = "PLAYING" | "STOPPED" | "PAUSED";

export type LoadStyle = "BUFFER" | "PLAY" | "NONE";

export type TimeMode = "ELAPSED" | "REMAINING";

interface TrackInfo {
  /**
   * Name to be used until ID3 tags can be resolved.
   *
   * If the track has a `url`, and this property is not given,
   * the filename will be used instead.
   *
   * Example: `'My Song'`
   */
  defaultName?: string;

  /**
   * Data to be used _instead_ of trying to fetch ID3 tags.
   *
   * Example: `{ artist: 'Jordan Eldredge', title: "Jordan's Song" }`
   */
  metaData?: {
    artist: string;
    title: string;
    album?: string;
    albumArtUrl?: string;
  };

  /**
   * Duration (in seconds) to be used instead of fetching enough of the file to measure its length.
   *
   * Example: 95
   */
  duration?: number;
}

export interface URLTrack extends TrackInfo {
  /**
   * Source URL of the track
   *
   * Note: This URL must be served the with correct CORs headers.
   *
   * Example: `'https://example.com/song.mp3'`
   */
  url: string;
}

export interface BlobTrack extends TrackInfo {
  /**
   * Blob source of the track
   */
  blob: Blob;
}

export interface LoadedURLTrack {
  url: string;
  metaData: {
    artist: string | null;
    title: string | null;
    album: string | null;
    albumArtUrl: string | null;
  };
}

/**
 * Many methods on the webamp instance deal with track.
 *
 * Either `url` or `blob` must be specified
 */
export type Track = URLTrack | BlobTrack;

export interface PlaylistTrack {
  id: number;
  artist?: string;
  title?: string;
  album?: string;
  url: string;
  defaultName: string | null;
  albumArtUrl?: string | null;
  mediaTagsRequestStatus: MediaTagRequestStatus;
  duration: number | null;
  kbps?: string;
  khz: string;
  channels?: number;
}

export type PartialState = unknown;

/**
 * Type definition of the music-metadata-browser module.
 * Ref: https://github.com/Borewit/music-metadata-browser/blob/master/src/index.ts
 */
export interface IMusicMetadataBrowserApi {
  /**
   * Parse Web API File
   * @param {Blob} blob
   * @param {IOptions} options Parsing options
   * @returns {Promise<IAudioMetadata>}
   */
  /**
   * Parse fetched file, using the Web Fetch API
   * @param {string} audioTrackUrl URL to download the audio track from
   * @param {IOptions} options Parsing options
   * @returns {Promise<IAudioMetadata>}
   */
  /**
   * Parse audio from Node Buffer
   * @param {Stream.Readable} stream Audio input stream
   * @param {string} mimeType <string> Content specification MIME-type, e.g.: 'audio/mpeg'
   * @param {IOptions} options Parsing options
   * @returns {Promise<IAudioMetadata>}
   */
}

export interface Extras {
  requireJSZip(): Promise<unknown>;
  requireMusicMetadata(): Promise<IMusicMetadataBrowserApi>;
  convertPreset: ((file: File) => Promise<object>) | null;
  handleTrackDropEvent?: (
    e: React.DragEvent<HTMLDivElement>,
  ) => Track[] | null | Promise<Track[] | null>;
  handleAddUrlEvent?: () => Track[] | null | Promise<Track[] | null>;
  handleLoadListEvent?: () => Track[] | null | Promise<Track[] | null>;
  handleSaveListEvent?: (tracks: Track[]) => null | Promise<null>;
}
