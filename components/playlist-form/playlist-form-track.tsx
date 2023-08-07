import clsx from "clsx";
import { memo } from "react";

import type { Song } from "@/features/music/types";

import { Combobox } from "@headlessui/react";

interface PlaylistFormTrackProps {
  song: Song;
}

export const PlaylistFormTrack = memo<PlaylistFormTrackProps>(({ song }) => {
  return (
    <Combobox.Option value={song}>
      {({ active }) => (
        <div
          className={clsx(
            "cursor-pointer space-x-1 px-4 py-2 text-gray-900 ",
            active && "bg-[#0078d7] text-gray-100",
          )}
        >
          <span className="font-medium ">{song.artist}</span>
          <span className="whitespace-pre font-light ">- {song.name}</span>
        </div>
      )}
    </Combobox.Option>
  );
});

PlaylistFormTrack.displayName = "PlaylistFormTrack";
