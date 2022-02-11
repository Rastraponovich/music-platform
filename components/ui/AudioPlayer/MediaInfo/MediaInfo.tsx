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
    const currentTrack = useStore(player.$currentTrack)
    const currentId = useStore(player.playList.$currentPlayedTrackIndexPlaylist)
    const playerState = useStore(player.$playerState)
    return (
        <div className="media-info flex text-[#00FF00]">
            {/* бегущая строка */}
            <MediaInfoTrack currentTrack={currentTrack!} currentId={currentId!} />
            {playerState !== EPLAYER_STATE.STOPED && (
                <KBPS bitrate={currentTrack?.metaData.format.bitrate} />
            )}
            {playerState !== EPLAYER_STATE.STOPED && (
                <KHZ sampleRate={currentTrack?.metaData.format.sampleRate} />
            )}
            <MonoStereo numberOfChannels={currentTrack?.metaData.format.numberOfChannels} />
        </div>
    )
}

export default memo(MediaInfo)
