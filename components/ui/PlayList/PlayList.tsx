import { player, PlayListGate } from "@/features/music/player"
import { Song } from "@/features/music/types"
import { Nullable } from "@/types"
import clsx from "clsx"
import { useEvent, useGate, useList, useStore } from "effector-react/scope"
import React, { memo, FC, useState } from "react"

interface PlayListProps {}

const PlayList: FC<PlayListProps> = () => {
    const [selectedTrack, setSelectedTrack] = useState<Nullable<number>>(null)

    const currentTrack = useStore(player.$currentTrack)
    const playList = useStore(player.playList.$playList)
    return (
        <aside
            className={clsx(
                "h-[100px] w-[100px] bg-green-200",
                playList.length === 0 ? "hidden" : "fixed"
            )}
        >
            {useList(player.playList.$playList, {
                keys: [selectedTrack, playList.length],
                fn: (track, index) => (
                    <div
                        onClick={() => setSelectedTrack(index)}
                        className={clsx(
                            "cursor-pointer",
                            selectedTrack === index && "bg-blue-600 text-white"
                        )}
                    >
                        {track.name}{" "}
                        {currentTrack?.playerPlayListId === track.playerPlayListId && "играем"}
                    </div>
                ),
            })}
        </aside>
    )
}

export default memo(PlayList)
