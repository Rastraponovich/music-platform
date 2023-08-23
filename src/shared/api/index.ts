import * as comments from "./rest/comments";
import * as playlists from "./rest/playlists";
import * as songs from "./rest/songs";

export * from "./client";

export const api = {
  songs,
  comments,
  playlists,
};
