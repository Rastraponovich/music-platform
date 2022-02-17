import { winampStates } from "@/features/media/winamp"
import { DEFALUT_WINDOW_STATE } from "@/features/music/constants"
import { TWinampWindow, UseDraggblePosition, UseDraggbleReturnProps } from "@/features/music/types"
import { useEvent } from "effector-react"
import { MouseEvent, Ref, useCallback, useEffect, useMemo, useState } from "react"

export const useDraggable = (WINDOW_NAME: TWinampWindow, ref: any): UseDraggbleReturnProps => {
    const handleActiveWindow = useEvent(winampStates.changeWindowState)

    const position = useMemo(() => {
        console.log(WINDOW_NAME, "rebind")

        return <UseDraggblePosition>DEFALUT_WINDOW_STATE[WINDOW_NAME]
    }, [WINDOW_NAME])

    useEffect(() => {
        ref.current.style.left = position.clientX + "px"
        ref.current.style.top = position.clientY + "px"
    }, [])

    const [diff, setDiff] = useState({
        diffX: 0,
        diffY: 0,
    })

    const [allowDragging, setAllowDragging] = useState<boolean>(false)
    const [picked, setPicked] = useState(false)

    const onDragStart = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            setPicked(true)
            handleActiveWindow(WINDOW_NAME)
            e.preventDefault()
            setDiff({
                diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
                diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
            })
            setAllowDragging(true)
        },
        [picked, diff, allowDragging]
    )
    const onDragging = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            if (allowDragging) {
                const left = e.screenX - diff.diffX
                const top = e.screenY - diff.diffY

                // if (e.pageX === 0) {
                //     return setTimeout(() => {
                //         setPosition({ ...position, clientX: 0 })
                //     }, 500)
                // }

                // setPosition({ ...position, clientX: left, clientY: top })
                ref.current.style.left = left + "px"
                ref.current.style.top = top + "px"
            }
        },
        [allowDragging, ref]
    )
    const onDragEnd = useCallback((e: MouseEvent<HTMLElement>) => {
        setAllowDragging(false)
    }, [])

    return [onDragStart, onDragging, onDragEnd]
}
