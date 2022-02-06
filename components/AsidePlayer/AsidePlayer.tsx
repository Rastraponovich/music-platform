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
    const [hidden, setHidden] = useState(false)
    return (
        <aside
            className={clsx(
                "fixed bottom-4 left-[10%] right-[10%] rounded bg-white px-10  shadow-md",
                hidden && "max-h-8 overflow-hidden"
            )}
        >
            <button
                className="absolute  right-0 top-0 bg-green-600 "
                onClick={() => setHidden((prev) => !prev)}
            >
                {!hidden ? "hide" : "show"}
            </button>
            <AudioPlayer className={clsx(hidden && "hidden")} />

            {hidden && <Progressbar className="w-full max-w-[calc(100%-2rem)]" />}
        </aside>
    )
}

export default memo(AsidePlayer)
