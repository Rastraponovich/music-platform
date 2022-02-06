import { player } from "@/features/music/player"
import clsx from "clsx"
import { useStore, useEvent } from "effector-react"
import React, { memo, FC, useState } from "react"
import AudioPlayer from "../ui/AudioPlayer/AudioPlayer"
import Progressbar from "../ui/Progressbar/Progressbar"

interface AsidePlayerProps {}

const AsidePlayer: FC<AsidePlayerProps> = () => {
    const currentTrack = useStore(player.$currentTrack)
    console.log("render asidePlayer")
    const [hidden, setHidden] = useState(false)
    return (
        <aside
            className={clsx(
                "fixed bottom-4 left-[10%] right-[10%] rounded bg-white px-10  shadow-md",
                hidden && "max-h-8 overflow-hidden"
            )}
        >
            <button
                className="absolute  right-0 -top-10 bg-green-600 p-4"
                onClick={() => setHidden((prev) => !prev)}
            >
                hide
            </button>
            {currentTrack && <AudioPlayer className={clsx(hidden && "hidden")} />}

            {hidden && <Progressbar className="w-full max-w-[calc(100%-2rem)]" />}
        </aside>
    )
}

export default memo(AsidePlayer)
