import { playlist, winamp } from "@/features/media/winamp"
import { player } from "@/features/music/player"
import { EPLAYER_STATE } from "@/features/music/types"
import { useStore } from "effector-react"
import React, { memo, FC } from "react"
import KBPS from "./KBPS"
import KHZ from "./KHZ"
import MediaInfoTrack from "./MediaInfoTrack"
import MonoStereo from "./MonoStereo"

interface MediaInfoProps {}

const MediaInfo: FC<MediaInfoProps> = () => {
    const currentTrack = useStore(winamp.$currentTrack)
    const currentId = useStore(playlist.$currentPlayedTrackIndexPlaylist)
    const playerState = useStore(winamp.$mediaStatus)
    return (
        <div className="media-info flex text-[#00FF00]">
            {/* бегущая строка */}
            <MediaInfoTrack currentTrack={currentTrack!} currentId={currentId!} />
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

export default memo(MediaInfo)
