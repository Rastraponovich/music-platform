import { $dummyVizData, $visualizerStyle, toggleVisualizerStyle } from "@/features/media/visualizer"
import { $baseSkinColors, $Media, winamp } from "@/features/media/winamp"
import { VISUALIZERS } from "@/features/music/constants"
import { usePaintBar, usePaintBarFrame } from "@/hooks/useBarVisualizer"
import { usePaintOscilloscopeFrame } from "@/hooks/useOscilloscopeVisualizer"
import { useStore } from "effector-react"
import { useEvent } from "effector-react/scope"
import React, { memo, FC, useState, useMemo, useCallback, useEffect } from "react"

interface VisualizerProps {}

const PIXEL_DENSITY = 2

function preRenderBg(
    width: number,
    height: number,
    bgColor: string,
    fgColor: string,
    windowShade: boolean
): HTMLCanvasElement {
    // Off-screen canvas for pre-rendering the background
    const bgCanvas = document.createElement("canvas")
    bgCanvas.width = width
    bgCanvas.height = height
    const distance = 2 * PIXEL_DENSITY

    const bgCanvasCtx = bgCanvas.getContext("2d")
    if (bgCanvasCtx == null) {
        throw new Error("Could not construct canvas context")
    }
    bgCanvasCtx.fillStyle = bgColor
    bgCanvasCtx.fillRect(0, 0, width, height)
    if (!windowShade) {
        bgCanvasCtx.fillStyle = fgColor
        for (let x = 0; x < width; x += distance) {
            for (let y = PIXEL_DENSITY; y < height; y += distance) {
                bgCanvasCtx.fillRect(x, y, PIXEL_DENSITY, PIXEL_DENSITY)
            }
        }
    }
    return bgCanvas
}

const Visualizer: FC<VisualizerProps> = () => {
    const mediaStatus = useStore(winamp.$mediaStatus)
    const style = useStore($visualizerStyle)
    const dummyVizData = useStore($dummyVizData)

    const colors = useStore($baseSkinColors)

    const media = useStore($Media)!
    const analyser = media._analyser
    const toggleVisualizer = useEvent(toggleVisualizerStyle)

    console.log(media._bands)

    const windowShade = false

    const renderWidth = windowShade ? 38 : 76
    const renderHeight = windowShade ? 5 : 16

    const width = renderWidth * PIXEL_DENSITY
    const height = renderHeight * PIXEL_DENSITY

    const bgCanvas = useMemo(() => {
        return preRenderBg(width, height, colors[0], colors[1], Boolean(windowShade))
    }, [colors, height, width, windowShade])

    const paintBar = usePaintBar({ height, renderHeight })

    const paintOscilloscopeFrame = usePaintOscilloscopeFrame({
        analyser,
        height,
        width,
        renderWidth,
    })

    const paintBarFrame = usePaintBarFrame({
        analyser,
        height,
        renderHeight,
    })

    const paintFrame = useCallback(
        (canvasCtx: CanvasRenderingContext2D) => {
            if (mediaStatus !== "PLAYING") {
                return
            }
            if (dummyVizData) {
                canvasCtx.drawImage(bgCanvas, 0, 0)
                Object.entries(dummyVizData).forEach(([i, value]) => {
                    paintBar(canvasCtx, Number(i), value, -1)
                })
                return
            }
            switch (style) {
                case VISUALIZERS.OSCILLOSCOPE:
                    canvasCtx.drawImage(bgCanvas, 0, 0)
                    paintOscilloscopeFrame(canvasCtx)
                    break
                case VISUALIZERS.BAR:
                    canvasCtx.drawImage(bgCanvas, 0, 0)
                    paintBarFrame(canvasCtx)
                    break
                default:
                    canvasCtx.clearRect(0, 0, width, height)
            }
        },
        [
            bgCanvas,
            dummyVizData,
            height,
            paintBar,
            paintBarFrame,
            paintOscilloscopeFrame,
            mediaStatus,
            style,
            width,
        ]
    )

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (canvas == null) {
            return
        }
        const canvasCtx = canvas.getContext("2d")
        if (canvasCtx == null) {
            return
        }
        canvasCtx.imageSmoothingEnabled = false

        let animationRequest: number | null = null
        // Kick off the animation loop
        const loop = () => {
            paintFrame(canvasCtx)
            animationRequest = window.requestAnimationFrame(loop)
        }
        loop()

        return () => {
            if (animationRequest != null) {
                window.cancelAnimationFrame(animationRequest)
            }
        }
    }, [canvas, paintFrame])

    if (mediaStatus === "STOPPED") {
        return null
    }

    return (
        <canvas
            className="h-4 w-[76px]"
            id="visualizer"
            ref={setCanvas}
            style={{ width: renderWidth, height: renderHeight }}
            width={width}
            height={height}
            onClick={toggleVisualizer}
        />
    )
}

export default Visualizer
