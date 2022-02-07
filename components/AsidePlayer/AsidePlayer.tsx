import { player } from "@/features/music/player"
import clsx from "clsx"
import { useStore, useEvent } from "effector-react"
import React, { memo, FC, useState } from "react"
import Progressbar from "../ui/Progressbar/Progressbar"

import dynamic from "next/dynamic"

const AudioPlayer = dynamic(() => import("../ui/AudioPlayer/AudioPlayer"), { ssr: false })

interface AsidePlayerProps {}

const AsidePlayer: FC<AsidePlayerProps> = () => {
    console.log("render asidePlayer")
    const currentTrack = useStore(player.$currentTrack)
    const hidden = useStore(player.$compact)
    const handleSetCompact = useEvent(player.onSetCompact)

    return (
        <aside
            className={clsx(
                "fixed bottom-4 left-[10%] right-[10%] rounded bg-white px-10  shadow-md",
                hidden && "max-h-8 overflow-hidden",
                !currentTrack && "hidden"
            )}
        >
            <button className="absolute  right-0 top-0 bg-green-600 " onClick={handleSetCompact}>
                {!hidden ? "hide" : "show"}
            </button>
            {currentTrack && <AudioPlayer className={clsx(hidden && "hidden")} />}

            {hidden && <Progressbar className="w-full max-w-[calc(100%-2rem)]" />}
        </aside>
    )
}

export default memo(AsidePlayer)
