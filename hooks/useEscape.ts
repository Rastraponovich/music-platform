import React, { useEffect } from "react"

const useEscape = () => {
    useEffect(() => {
        const handleEsc = (event: any) => {
            if (event.keyCode === 27) console.log(event)
        }
        window.addEventListener("keydown", handleEsc)

        return () => {
            window.removeEventListener("keydown", handleEsc)
        }
    }, [])
}

export default useEscape
