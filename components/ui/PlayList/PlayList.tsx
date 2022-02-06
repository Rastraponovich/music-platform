import { player, PlayListGate } from "@/features/music/player"
import clsx from "clsx"
import { useEvent, useGate, useList, useStore } from "effector-react/scope"
import React, { memo, FC } from "react"

interface PlayListProps {}

const PlayList: FC<PlayListProps> = () => {
    const handleSelectTrack = useEvent(player.selectTrack)

    const plisEmpty = useStore(player.playList.$playListEnabled)
    return (
        <aside
            className={clsx("h-[100px] w-[100px] bg-green-200", !plisEmpty ? "hidden" : "fixed")}
        >
            {useList(player.playList.$playList, {
                fn: (track) => (
                    <div onClick={() => handleSelectTrack(track)} className="cursor-pointer">
                        {track.name}
                    </div>
                ),
                keys: [plisEmpty],
            })}
        </aside>
    )
}

export default memo(PlayList)
