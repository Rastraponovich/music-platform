import Media from "@/features/media"
import { initWinamp, loadUrl } from "@/features/media/winamp"
import { Nullable } from "@/types"
import { useEvent } from "effector-react/scope"
import React, { memo, FC, useState, useEffect } from "react"

interface testProps {}

const test: FC<testProps> = () => {
    const handleInitWinamp = useEvent(initWinamp)
    const handleLoadUrl = useEvent(loadUrl)

    useEffect(() => {
        handleInitWinamp()
    }, [])

    return (
        <div className="flex grow p-20">
            <div className="flex">
                <span
                    className="h-4"
                    onClick={() =>
                        handleLoadUrl({
                            url: `/music/5b0c8552-6b88-4ac6-b4c5-01c8ffcf3303.mp3`,
                            autoPlay: true,
                        })
                    }
                >
                    song 1{" "}
                </span>
                <span
                    className="h-4"
                    onClick={() =>
                        handleLoadUrl({
                            url: `/music/9baf25af-33ea-4525-bfc6-6500b06c3403.mp3`,
                            autoPlay: true,
                        })
                    }
                >
                    song 2
                </span>
            </div>
        </div>
    )
}

export default memo(test)
