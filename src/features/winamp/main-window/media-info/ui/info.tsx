import { Character } from "@/src/shared/ui/winamp/character-strings"
import clsx from "clsx"
import { memo } from "react"

interface KBPSProps {
    bitrate: number
}

export const KBPS = memo(({ bitrate }: KBPSProps) => {
    return (
        <div id="kbps" className="text-opacity-0">
            <Character num={String(bitrate).charAt(0)} />
            <Character num={String(bitrate).charAt(1)} />
            <Character num={String(bitrate).charAt(2)} />
        </div>
    )
})
KBPS.displayName = "KBPS"

interface KHZProps {
    sampleRate: number
}

export const KHZ = memo(({ sampleRate }: KHZProps) => {
    return (
        <div id="khz" className="text-opacity-0">
            <Character num={String(sampleRate).charAt(0)} />
            <Character num={String(sampleRate).charAt(1)} />
        </div>
    )
})
KHZ.displayName = "KHZ"

interface MonoStereoProps {
    numberOfChannels: number
}

export const MonoStereo = memo(({ numberOfChannels }: MonoStereoProps) => {
    return (
        <div className="mono-stereo">
            <div id="stereo" className={clsx(numberOfChannels === 2 && "selected")}></div>
            <div id="mono" className={clsx(numberOfChannels !== 2 && "selected")}></div>
        </div>
    )
})

MonoStereo.displayName = "MonoStereo"
