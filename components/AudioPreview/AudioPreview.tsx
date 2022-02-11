import React, { memo, FC } from "react"

interface AudioPreviewProps {
    audio: File
}

const AudioPreview = ({ audio }: AudioPreviewProps) => {
    return (
        <div className="relative scale-75 self-start">
            <audio controls src={URL.createObjectURL(audio)} className="absolute left-0" />
        </div>
    )
}

export default memo(AudioPreview)
