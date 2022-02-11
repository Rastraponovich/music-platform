import { Song } from "@/features/music/types"
import { Combobox } from "@headlessui/react"
import clsx from "clsx"
import React, { memo, FC } from "react"

interface PlaylistFormTrackProps {
    song: Song
}

const PlaylistFormTrack = ({ song }: PlaylistFormTrackProps) => {
    return (
        <Combobox.Option value={song}>
            {({ active }) => (
                <div
                    className={clsx(
                        "cursor-pointer space-x-1 px-4 py-2 text-gray-900 ",
                        active && "bg-[#0078d7] text-gray-100"
                    )}
                >
                    <span className="font-medium ">{song.artist}</span>
                    <span className="whitespace-pre font-light ">- {song.name}</span>
                </div>
            )}
        </Combobox.Option>
    )
}

export default memo(PlaylistFormTrack)
