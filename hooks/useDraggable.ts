import { winampStates } from "@/features/media/winamp"
import { DEFALUT_WINDOW_STATE } from "@/features/music/constants"
import { TWinampWindow, UseDraggblePosition, UseDraggbleReturnProps } from "@/features/music/types"
import { useEvent } from "effector-react"
import { MouseEvent, useCallback, useState } from "react"

export const useDraggable = (WINDOW_NAME: TWinampWindow): UseDraggbleReturnProps => {
    const handleActiveWindow = useEvent(winampStates.changeWindowState)

    const [position, setPosition] = useState<UseDraggblePosition>(DEFALUT_WINDOW_STATE[WINDOW_NAME])

    const [diff, setDiff] = useState({
        diffX: 0,
        diffY: 0,
    })

    const [allowDragging, setAllowDragging] = useState<boolean>(false)

    const onDragStart = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            handleActiveWindow(WINDOW_NAME)
            e.preventDefault()
            setDiff({
                diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
                diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
            })
            setPosition(position)
            setAllowDragging(true)
        },
        [diff, position, allowDragging]
    )
    const onDragging = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            console.log(e)
            if (allowDragging) {
                const left = e.screenX - diff.diffX
                const top = e.screenY - diff.diffY

                if (e.pageX === 0) {
                    return setTimeout(() => {
                        setPosition({ ...position, clientX: 0 })
                    }, 500)
                }

                setPosition({ ...position, clientX: left, clientY: top })
            }
        },
        [position, allowDragging]
    )
    const onDragEnd = useCallback((e: MouseEvent<HTMLElement>) => setAllowDragging(false), [])

    return { position, onDragStart, onDragging, onDragEnd }
}
