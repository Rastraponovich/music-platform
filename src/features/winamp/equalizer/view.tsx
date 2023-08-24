import clsx from "clsx";
import { useUnit } from "effector-react";
import { ChangeEvent, MouseEvent, memo, useCallback, useMemo, useRef, useState } from "react";
import "react";

import { $clutterBar, marqueInfo, winampStates } from "~/widgets/winamp";

import { useDraggable } from "~/shared/hooks/use-draggable";
import { WinampButton } from "~/shared/ui/winamp/winamp-button";

import { GRAPH_HEIGHT, GRAPH_WIDTH, TALL_SPRITE, WIDE_SPRITE, WINDOW_NAME } from "./constants";
import {
  $autoEQ,
  $bands,
  $enabledEQ,
  $minimizedEQ,
  $preamp,
  $visibleEQ,
  changeAllBandsValues,
  changeEQBand,
  changePreampValue,
  enableClickedEQ,
  resetEqBand,
  toggleAutoEQ,
  toggleMinimizeEQ,
  toggleVisibleEQ,
  toggleVisiblePresetWindow,
} from "./model";
import { PresetMenu } from "./preset-menu";
import { spriteNumber, spriteOffsets } from "./utils";

/* @todo refactor file  */

export const EQWindow = () => {
  const ref = useRef(null);
  const clutter = useUnit($clutterBar);
  const [minimized, visibled] = useUnit([$minimizedEQ, $visibleEQ]);

  const handleActiveWindow = useUnit(winampStates.changeWindowState);

  const handleActiveWindowClicked = () => handleActiveWindow(WINDOW_NAME);

  const [onDragStart, onDragging, onDragEnd] = useDraggable(WINDOW_NAME, ref);

  return (
    <div
      id="equalizer-window"
      className={clsx(
        "fixed top-[116px] z-50 h-[116px] w-[275px] cursor-winamp pixelated",
        minimized && "shade max-h-3.5 overflow-hidden",
        !visibled && "hidden",
        clutter.d && "origin-top-left scale-[2]",
      )}
      ref={ref}
      onClick={handleActiveWindowClicked}
    >
      <EQHeader
        onMouseDown={onDragStart}
        onMouseMove={onDragging}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      />
      <EQButtons />
      <Sliders />
    </div>
  );
};

interface EQSliderProps {
  name: string;
  value: number;
  title?: string;
  reset?: (id: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const EQSlider = memo(({ name, value, onChange, reset, title }: EQSliderProps) => {
  const [active, setActive] = useState(false);

  const [mouseDown, mouseUp] = useUnit([
    marqueInfo.enabledMarqueInfo,
    marqueInfo.disabledMarqueInfo,
  ]);

  const handleMouseUp = (_: MouseEvent<HTMLInputElement>) => {
    setActive(false);
    mouseUp();
  };
  const handleMouseDown = (_: MouseEvent<HTMLInputElement>) => {
    setActive(true);
    mouseDown();
  };

  const backgroundPosition = useMemo(() => {
    const { x, y } = spriteOffsets(spriteNumber(value));
    const xOffset = x * WIDE_SPRITE;
    const yOffset = y * TALL_SPRITE;

    return `-${xOffset}px -${yOffset}px`;
  }, [value]);

  const handleDblClick = () => reset && reset(name);

  return (
    <label className="ml-px flex  h-[62px] w-3.5 bg-band-bg p-0" style={{ backgroundPosition }}>
      <input
        id="band-slider"
        type="range"
        name={name}
        className={clsx(
          "slider-thumb -rotate-90 cursor-winamp-position-y appearance-none",
          "m-0 h-3.5 w-[62px] origin-[31px_31px] bg-transparent",
          active && "active",
        )}
        min="0"
        max="100"
        value={value}
        title={title}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onChange={onChange}
        onDoubleClick={handleDblClick}
      />
    </label>
  );
});

EQSlider.displayName = "EQSlider";

const Sliders = () => {
  const [bands, preamp] = useUnit([$bands, $preamp]);
  const [handleChangePreamp, handleResetEQ, handleChangeAllBandsValues, handleChange] = useUnit([
    changePreampValue,
    resetEqBand,
    changeAllBandsValues,
    changeEQBand,
  ]);

  const memoHandleChange = useCallback((e) => handleChange(e), [handleChange]);

  const handleSetMaxBandsValuesClicked = () => handleChangeAllBandsValues("max");
  const handleSetMinBandsValuesClicked = () => handleChangeAllBandsValues("min");
  const handleResetBandsValuesClicked = () => handleChangeAllBandsValues("reset");

  return (
    <div className="flex space-x-1 px-[21px] pt-1">
      <EQSlider
        name="preamp"
        value={preamp}
        onChange={handleChangePreamp}
        title="Предварительное усилинеие"
      />
      <div className=" flex w-3.5 flex-col justify-between" style={{ margin: "0 12px" }}>
        <button className="h-2 w-4 cursor-winamp" onClick={handleSetMaxBandsValuesClicked}></button>
        <button className="h-2 w-4 cursor-winamp" onClick={handleResetBandsValuesClicked}></button>
        <button className="h-2 w-4 cursor-winamp" onClick={handleSetMinBandsValuesClicked}></button>
      </div>

      {Object.entries(bands).map(([key, value]) => (
        <EQSlider
          name={key}
          value={value}
          key={key}
          onChange={memoHandleChange}
          reset={handleResetEQ}
          title={`${key} Гц`}
        />
      ))}
    </div>
  );
};

const EQButtons = () => {
  return (
    <div className="flex h-[19px] items-start justify-between px-3.5 pt-1">
      <EnableEQToggleButton />
      <AutoEQToggleButton />
      <EQGraph />
      <div className="relative flex items-start">
        <PresetMenuButton />
        <PresetMenu />
      </div>
    </div>
  );
};

const PresetMenuButton = () => {
  const toggleVisiblePresetMenu = useUnit(toggleVisiblePresetWindow);

  const handleTogglePresetMenuButtonClicked = useCallback(
    () => toggleVisiblePresetMenu(),
    [toggleVisiblePresetMenu],
  );

  return (
    <WinampButton id="presets" className="h-3 w-11" onClick={handleTogglePresetMenuButtonClicked} />
  );
};

const EnableEQToggleButton = () => {
  const [enabledEQ, toggleOn] = useUnit([$enabledEQ, enableClickedEQ]);

  return <WinampButton id="on" className="h-3 w-[26px]" active={enabledEQ} onClick={toggleOn} />;
};
const AutoEQToggleButton = () => {
  const [handleToggle, enabledAutoEQ] = useUnit([toggleAutoEQ, $autoEQ]);

  return (
    <WinampButton id="auto" className="h-3 w-8" active={enabledAutoEQ} onClick={handleToggle} />
  );
};

interface EQHeaderProps {
  onMouseDown: (e: MouseEvent<HTMLElement>) => void;
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseUp: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: MouseEvent<HTMLElement>) => void;
}

const EQHeader = memo(({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: EQHeaderProps) => {
  const [minimized] = useUnit([$minimizedEQ]);
  const windowState = useUnit(winampStates.$activeWindow);

  const [handleMinimize, handleCloseEQ] = useUnit([toggleMinimizeEQ, toggleVisibleEQ]);

  return (
    <div
      className={clsx(
        "equalizer-top relative flex h-3.5 cursor-winamp-move justify-end",
        windowState === WINDOW_NAME && "active",
        minimized && "shade",
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <button
        id="equalizer-shade"
        className="h-3.5 w-3.5 cursor-winamp-move"
        onClick={handleMinimize}
      />
      <button
        id="equalizer-close"
        className="h-3.5 w-3.5 cursor-winamp-move"
        onClick={handleCloseEQ}
      />
    </div>
  );
});

EQHeader.displayName = "EQHeader";

/* @todo refactor export  */

const EQGraph = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  return (
    <canvas width={GRAPH_WIDTH} height={GRAPH_HEIGHT} className="mx-3.5" ref={canvas}></canvas>
  );
};
