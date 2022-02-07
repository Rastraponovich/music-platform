import { initPlayer, player } from "@/features/music/player"
import { useEvent, useGate, useStore } from "effector-react"
import Image from "next/image"

import React, { memo, FC, useEffect, useState } from "react"
import PauseIcon from "../icons/PauseIcon/PauseIcon"
import PlayIcon from "../icons/PlayIcon/PlayIcon"
import Progressbar from "../Progressbar/Progressbar"
import clsx from "clsx"
import AudioPlayerTimer from "./AudioPlayerTimer"
import RefreshIcon from "../icons/RefreshIcon/RefreshIcon"
import { useRouter } from "next/router"

interface AudioPlayerProps {
    className?: string
}
let audioEL: HTMLAudioElement
const AudioPlayer: FC<AudioPlayerProps> = ({ className }) => {
    const track = useStore(player.$currentTrack)

    const handleInitPlater = initPlayer

    //инициализация
    useEffect(() => {
        handleInitPlater()
        // setAudio()
        // handlePlay()

        //unmount
        // return () => audio.pause()
    }, [track])
    const loop = useStore(player.$loop)
    const playing = useStore(player.$playing)
    const duration = useStore(player.$duration)
    const volume = useStore(player.volume.$volume)
    const trackLoaded = useStore(player.$trackLoaded)
    const allowSeeking = useStore(player.progress.$allowSeeking)
    const seekingProgress = useStore(player.progress.$seekingProgress)

    const [handlePlay, handlePause, handleSetLoop, onVolumeChange] = useEvent([
        player.onPlay,
        player.onPause,
        player.onSetLoopEnabled,
        player.volume.onVolumeChange,
    ])

    //подсчет прослушки

    // useEffect(() => {
    //     if (audio.src.length > 0) {
    //         if (audio.buffered.length)
    //             timerId = setInterval(() => {
    //                 console.log(audio.buffered.end(0))
    //             }, 100)
    //     }
    //     return () => clearInterval(timerId)
    // })

    // useEffect(() => {
    //     if (playing) {
    //         timerId = setInterval(() => {
    //             setListnerTimer((prev) => ++prev)
    //         }, 1000)
    //     }
    //     return () => clearInterval(timerId)
    // }, [audio, playing, track])

    //добавление прослушивания
    // useEffect(() => {
    //     if (listnerTimer > 10 && !listensAdded) {
    //         setListens((prev) => ++prev)
    //         setListensAdded(true)
    //     }
    // }, [listensAdded, listnerTimer])

    return (
        <div className={clsx("flex flex-col py-4", className)}>
            <div className="grid grid-cols-12 items-center">
                <button
                    onClick={() => (playing ? handlePause() : handlePlay())}
                    className="col-span-2"
                >
                    {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="col-span-6 flex space-x-2">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track?.cover}`}
                        objectFit="contain"
                        height={50}
                        width={50}
                    />
                    <div className=" flex grow flex-col">
                        <span className="text-base font-medium">{track?.name}</span>
                        <span className="text-sm font-light text-gray-800">{track?.artist}</span>
                    </div>
                </div>
                <AudioPlayerTimer duration={duration} />
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="col-span-2 col-end-13"
                />
                <Progressbar className="col-span-8 col-start-3" />
                <button
                    className="col-span-1 col-start-11 justify-self-end "
                    onClick={() => handleSetLoop()}
                >
                    <RefreshIcon size="small" color={clsx(loop ? "currentColor" : "#9ca3af")} />
                </button>
            </div>
        </div>
    )
}

export default memo(AudioPlayer)
