import clsx from "clsx"
import Image from "next/image"
import { memo, FC } from "react"
import { useEvent, useStore } from "effector-react"

import { player } from "@/features/music/player"

import PlayIcon from "../icons/PlayIcon/PlayIcon"
import PauseIcon from "../icons/PauseIcon/PauseIcon"
import Progressbar from "../Progressbar/Progressbar"
import RefreshIcon from "../icons/RefreshIcon/RefreshIcon"
import DocumentTextIcon from "../icons/DocumentTextIcon/DocumentTextIcon"
import TrackTimer from "@/components/TrackListItem/TrackTimer"
import AudioPlayerTimer from "./AudioPlayerTimer"
import PlayList from "../PlayList/PlayList"

interface AudioPlayerProps {
    className?: string
}
const AudioPlayer: FC<AudioPlayerProps> = ({ className }) => {
    const track = useStore(player.$currentTrack)

    const loop = useStore(player.$loop)
    const playing = useStore(player.$playing)

    const volume = useStore(player.volume.$volume)

    const [handlePlay, handlePause, handleSetLoop, onVolumeChange, handleSetShowPlaylist] =
        useEvent([
            player.controls.onPlayClicked,
            player.controls.onPauseClicked,
            player.onSetLoopEnabled,
            player.volume.changeVolume,
            player.playList.setShowVisiblePlaylist,
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
        <div className={clsx("z-40 flex flex-col ", className)}>
            <div className="mb-4 grid grid-cols-12 items-center">
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
                <AudioPlayerTimer />
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={onVolumeChange}
                    className="col-span-2 col-end-13"
                />
                <Progressbar
                    id="#position"
                    className="absolute left-4 top-[97px] col-span-8 col-start-3 h-2.5 w-[248px] appearance-none bg-progresbar-player"
                />

                <div className="col-span-2 col-start-11 flex space-x-2 justify-self-end py-1">
                    <button onClick={() => handleSetLoop()}>
                        <RefreshIcon size="small" color={clsx(loop ? "currentColor" : "#9ca3af")} />
                    </button>

                    <button onClick={() => handleSetShowPlaylist()}>
                        <DocumentTextIcon size="small" />
                    </button>
                </div>
            </div>
            <PlayList />
        </div>
    )
}

export default memo(AudioPlayer)
