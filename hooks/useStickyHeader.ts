import { useState, useEffect, useRef, useCallback } from "react"
const useStickyHeader = (defaultSticky = false) => {
    const [isSticky, setIsSticky] = useState(defaultSticky)
    const ref = useRef<any>(null)
    const toggleSticky = useCallback(
        ({ top, bottom }) => {
            console.log(top, bottom)

            if (top <= 0 && bottom !== 82) {
                !isSticky && setIsSticky(true)
            } else {
                isSticky && setIsSticky(false)
            }
        },
        [isSticky]
    )
    useEffect(() => {
        const handleScroll = () => {
            toggleSticky(ref.current.getBoundingClientRect())
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [toggleSticky])
    return { ref, isSticky }
}
export default useStickyHeader
