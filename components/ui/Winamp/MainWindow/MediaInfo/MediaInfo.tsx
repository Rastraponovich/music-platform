import { useStore } from "effector-react"

import { playlist, winamp, winampStates } from "@/features/media/winamp"

import KHZ from "./KHZ"
import KBPS from "./KBPS"
import MonoStereo from "./MonoStereo"
import MediaInfoTrack from "./MediaInfoTrack"
import { WINAMP_STATE } from "@/features/music/constants"
import { useMemo } from "react"

interface MediaInfoProps {}

const MediaInfo = () => {
    const currentTrack = useStore(winamp.$currentTrack)
    const currentId = useStore(playlist.$currentPlayedTrackIndex)
    const playerState = useStore(winamp.$mediaStatus)
    const winampState = useStore(winampStates.$winampState)

    const allow = useMemo(
        () => currentTrack !== null && winampState !== WINAMP_STATE.CLOSED,
        [currentTrack, winampState]
    )

    console.log(winampState)
    return (
        <div className="media-info flex text-[#00FF00]">
            {/* бегущая строка */}
            {allow && <MediaInfoTrack currentTrack={currentTrack!} currentId={currentId!} />}
            {playerState !== "STOPPED" && (
                <KBPS bitrate={currentTrack?.metaData.format.bitrate || 0} />
            )}
            {playerState !== "STOPPED" && (
                <KHZ sampleRate={currentTrack?.metaData.format.sampleRate || 0} />
            )}
            <MonoStereo numberOfChannels={currentTrack?.metaData.format.numberOfChannels || 0} />
        </div>
    )
}

export default MediaInfo
