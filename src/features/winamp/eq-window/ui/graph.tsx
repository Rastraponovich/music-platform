import React, { memo, useRef } from "react"

const GRAPH_HEIGHT = 19
const GRAPH_WIDTH = 113

export const EQGraph = () => {
    const canvas = useRef<HTMLCanvasElement>(null)

    return (
        <canvas width={GRAPH_WIDTH} height={GRAPH_HEIGHT} className="mx-3.5" ref={canvas}></canvas>
    )
}
