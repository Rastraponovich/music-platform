import type { Song } from "~/entity/songs";

export type Album = {
  id: number;
  title: string;
  content: string;
  playlistId?: number;
  tracks?: Song[];
  backgroundImage?: string;
};
