import { memo } from "react"
import {
    NextTrackButton,
    OpenFileButton,
    PauseButton,
    PlayButton,
    PrevButton,
    StopButton,
} from "./buttons"

interface MiniActionsProps {
    bottom?: boolean
}

export const MiniActions = memo(({ bottom = false }: MiniActionsProps) => {
    return (
        <div className="flex items-center">
            <PrevButton />
            <PlayButton />
            <PauseButton />
            <StopButton />
            <NextTrackButton />
            <OpenFileButton />
            {!bottom && <div id="position" className="mr-0.5 h-[7px] w-[17px]"></div>}
        </div>
    )
})

MiniActions.displayName = "MiniActions"
