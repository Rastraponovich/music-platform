import clsx from "clsx";
import { useUnit } from "effector-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { $baseSkinColors, $mediaElement, $mediaStatus, $shadePlayer } from "~/widgets/winamp";

import { usePaintBar, usePaintBarFrame } from "~/shared/hooks/use-bar-visualizer";
import { usePaintOscilloscopeFrame } from "~/shared/hooks/use-oscilloscope-visualizer";

import { PIXEL_DENSITY, Visualizers } from "./constants";
import { $dummyVizData, $visualizerStyle, toggleVisualizerStyle } from "./model";

interface VisualizerProps {
  className?: string;
}

//TODO bug: when winamp opened without track

function preRenderBg(
  width: number,
  height: number,
  bgColor: string,
  fgColor: string,
  windowShaded: boolean = false,
): HTMLCanvasElement {
  // eslint-disable-next-line lines-around-comment
  // Off-screen canvas for pre-rendering the background
  const bgCanvas = document.createElement("canvas");

  bgCanvas.width = width;
  bgCanvas.height = height;
  const distance = 2 * PIXEL_DENSITY;

  const bgCanvasCtx = bgCanvas.getContext("2d");

  if (bgCanvasCtx == null) {
    throw new Error("Could not construct canvas context");
  }
  bgCanvasCtx.fillStyle = bgColor;
  bgCanvasCtx.fillRect(0, 0, width, height);

  if (!windowShaded) {
    bgCanvasCtx.fillStyle = fgColor;
    for (let x = 0; x < width; x += distance) {
      for (let y = PIXEL_DENSITY; y < height; y += distance) {
        bgCanvasCtx.fillRect(x, y, PIXEL_DENSITY, PIXEL_DENSITY);
      }
    }
  }
  return bgCanvas;
}

export const Visualizer = (_: VisualizerProps) => {
  const [mediaStatus, style, dummyVizData, colors] = useUnit([
    $mediaStatus,
    $visualizerStyle,
    $dummyVizData,
    $baseSkinColors,
  ]);

  const [media, windowShaded] = useUnit([$mediaElement, $shadePlayer])!;

  const analyser = media!._analyser;
  const toggleVisualizer = useUnit(toggleVisualizerStyle);

  const renderWidth = windowShaded ? 38 : 76;
  const renderHeight = windowShaded ? 5 : 16;

  const width = renderWidth * PIXEL_DENSITY;
  const height = renderHeight * PIXEL_DENSITY;

  const bgCanvas = useMemo(() => {
    return preRenderBg(width, height, colors[0], colors[1], windowShaded);
  }, [colors, height, width, windowShaded]);

  const paintBar = usePaintBar({ height, renderHeight });

  const paintOscilloscopeFrame = usePaintOscilloscopeFrame({
    analyser,
    height,
    width,
    renderWidth,
  });

  const paintBarFrame = usePaintBarFrame({
    analyser,
    height,
    renderHeight,
  });

  const paintFrame = useCallback(
    (canvasCtx: CanvasRenderingContext2D) => {
      if (mediaStatus !== "PLAYING") {
        return;
      }

      if (dummyVizData) {
        canvasCtx.drawImage(bgCanvas, 0, 0);
        Object.entries(dummyVizData).forEach(([i, value]) => {
          paintBar(canvasCtx, Number(i), value, -1);
        });
        return;
      }
      switch (style) {
        case Visualizers.OSCILLOSCOPE:
          canvasCtx.drawImage(bgCanvas, 0, 0);
          paintOscilloscopeFrame(canvasCtx);
          break;

        case Visualizers.BAR:
          canvasCtx.drawImage(bgCanvas, 0, 0);
          paintBarFrame(canvasCtx);
          break;

        default:
          canvasCtx.clearRect(0, 0, width, height);
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
    ],
  );

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvas == null) {
      return;
    }
    const canvasCtx = canvas.getContext("2d");

    if (canvasCtx == null) {
      return;
    }
    canvasCtx.imageSmoothingEnabled = false;

    let animationRequest: number | null = null;
    // eslint-disable-next-line lines-around-comment
    // Kick off the animation loop
    const loop = () => {
      paintFrame(canvasCtx);
      animationRequest = window.requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animationRequest != null) {
        window.cancelAnimationFrame(animationRequest);
      }
    };
  }, [canvas, paintFrame]);

  if (mediaStatus === "STOPPED") {
    return null;
  }

  return (
    <canvas
      className={clsx(
        " h-4 w-[76px]",
        windowShaded ? "top-[5px] left-[79px]" : "top-[43px] left-[24px]",
      )}
      id="visualizer"
      ref={setCanvas}
      style={{ width: renderWidth, height: renderHeight }}
      width={width}
      height={height}
      onClick={toggleVisualizer}
    />
  );
};
