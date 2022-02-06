import { player, PlayerGate } from "@/features/music/player"
import { useEvent, useGate, useStore } from "effector-react"
import Image from "next/image"

import React, { memo, FC, useEffect } from "react"
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
let audio: HTMLAudioElement
const AudioPlayer: FC<AudioPlayerProps> = ({ className }) => {
    useGate(PlayerGate)

    const track = useStore(player.$currentTrack)

    const router = useRouter()

    //инициализация
    useEffect(() => {
        audio = new Audio()
        setAudio()
        handlePlay()

        //unmount
        return () => audio.pause()
    }, [track])
    const loop = useStore(player.$loop)
    const playing = useStore(player.$playing)
    const duration = useStore(player.$duration)
    const volume = useStore(player.volume.$volume)
    const trackLoaded = useStore(player.$trackLoaded)
    const allowSeeking = useStore(player.progress.$allowSeeking)
    const seekingProgress = useStore(player.progress.$seekingProgress)

    const handlePlay = useEvent(player.onPlay)
    const handlePause = useEvent(player.onPause)
    const handleLoadTrack = useEvent(player.initTrack)
    const handleSetDuration = useEvent(player.setDuration)
    const handleSetLoop = useEvent(player.onSetLoopEnabled)
    const handleSetVolume = useEvent(player.volume.initVolume)
    const handleSetProgress = useEvent(player.progress.initProgress)

    const setAudio = () => {
        audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`
        audio.volume = volume / 100
        audio.loop = loop

        audio.onloadedmetadata = () => handleSetDuration(Math.ceil(audio.duration))
        audio.ontimeupdate = () => handleSetProgress(Math.ceil(audio.currentTime))
        audio.onvolumechange = () => handleSetVolume(audio.volume * 100)
        audio.onloadeddata = () => handleLoadTrack(audio.readyState)
        audio.onpause = () => audio.ended && handlePause()

        audio.preload = "auto"

        if (playing) return handlePause()
    }

    useEffect(() => {
        if (audio.readyState) {
            handleLoadTrack(audio.readyState)
        }
    }, [audio?.readyState])
    //перемотка
    useEffect(() => {
        if (allowSeeking) audio.currentTime = seekingProgress
    }, [seekingProgress, allowSeeking])

    //looping
    useEffect(() => {
        audio.loop = loop
    }, [loop, audio])

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

    useEffect(() => {
        if (trackLoaded) {
            if (playing) {
                audio.play()
            } else {
                audio.pause()
            }
            return () => audio.pause()
        }
    }, [playing, trackLoaded])

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        audio.volume = Number(e.target.value) / 100
    }

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
                        src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track!.cover}`}
                        objectFit="contain"
                        height={50}
                        width={50}
                    />
                    <div className=" flex grow flex-col">
                        <span className="text-base font-medium">{track!.name}</span>
                        <span className="text-sm font-light text-gray-800">{track!.artist}</span>
                    </div>
                </div>
                <AudioPlayerTimer duration={duration} />
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={changeVolume}
                    className="col-span-2 col-end-13"
                />
                <Progressbar className="col-span-8 col-start-3" />
                <button
                    className="col-span-1 col-start-11 justify-self-end "
                    onClick={handleSetLoop}
                >
                    <RefreshIcon size="small" color={clsx(loop ? "currentColor" : "#9ca3af")} />
                </button>
            </div>
        </div>
    )
}

export default memo(AudioPlayer)
