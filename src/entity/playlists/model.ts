export type Playlist = {
  id?: number;
  name: string;
  isActive: boolean;
  comments: unknown[];
  creatorId: number;
  creator: unknown;
  songs: unknown[];
};
