import { $clutterBar, changeClutterBar } from "@/features/media/winamp"
import clsx from "clsx"
import { useEvent, useStore, useStoreMap } from "effector-react"
import React, { memo, FC } from "react"

interface ClutterBarProps {}

const ClutterBar = () => {
    const clutterBar = useStore($clutterBar)
    const handleChangeClutterBar = useEvent(changeClutterBar)

    return (
        <div id="clutter-bar" className="flex h-[43px] w-2 flex-col justify-start pt-[2px]">
            <div>
                <div className="handle h-full w-full">
                    <div
                        id="button-o"
                        onClick={() => handleChangeClutterBar("o")}
                        className={clsx(clutterBar.o && "selected", "h-2 w-2")}
                    ></div>
                </div>
            </div>
            <div
                id="button-a"
                onClick={() => handleChangeClutterBar("a")}
                className={clsx(clutterBar.a && "selected", "h-2 w-2")}
            ></div>
            <div
                id="button-i"
                onClick={() => handleChangeClutterBar("i")}
                className={clsx(clutterBar.i && "selected", "h-2 w-2")}
            ></div>
            <div
                title="Toggle Doublesize Mode"
                id="button-d"
                className={clsx(clutterBar.d && "selected", "h-2 w-2")}
                onClick={() => handleChangeClutterBar("d")}
            ></div>
            <div
                id="button-v"
                onClick={() => handleChangeClutterBar("v")}
                className={clsx(clutterBar.v && "selected", "h-2 w-2")}
            ></div>
        </div>
    )
}

export default ClutterBar
