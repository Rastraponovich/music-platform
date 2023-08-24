import clsx from "clsx";
import { useUnit } from "effector-react";
import { MouseEventHandler, memo } from "react";

import { WinampButton } from "~/shared/ui/winamp/winamp-button";

import { MiniActions } from "../controls-panel";
import { MiniTimer } from "../mini-timer";
import {
  $isActiveWindow,
  $shaded,
  closeButtonClicked,
  minimizeButtonClicked,
  shadeButtonClicked,
} from "./model";

interface TitleBarProps {
  onMouseDown: MouseEventHandler;
  onMouseMove: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
}

export const TitleBar = memo<TitleBarProps>(
  ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }) => {
    const [isActiveWindow, shaded] = useUnit([$isActiveWindow, $shaded]);

    const [handleMinimize, handleShade, handleClose] = useUnit([
      minimizeButtonClicked,
      shadeButtonClicked,
      closeButtonClicked,
    ]);

    return (
      <div
        id="title-bar"
        className={clsx(
          "draggable title-bar relative flex h-3.5 w-[275px] cursor-winamp-move items-center pl-1.5 pt-[3px] pr-[3px] pb-0.5",
          isActiveWindow && "selected",
          shaded && "shade min-h-[14px]",
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <button id="option-context" className="h-full w-3.5 cursor-winamp" title="Winamp Menu" />
        <div className="grow"></div>

        {shaded && <MiniTimer className="relative mr-[7px] items-center" />}

        {shaded && <MiniActions />}
        <WinampButton
          id="minimize"
          title="Minimize"
          className="h-[9px] w-[9px] cursor-winamp-move"
          onClick={handleMinimize}
        />
        <WinampButton
          id="shade"
          title="Toggle Windowshade Mode"
          className="h-[9px] w-[9px] cursor-winamp-move"
          onClick={handleShade}
        />
        <WinampButton
          id="close"
          title="Close"
          className="h-[9px] w-[9px] cursor-winamp-attention"
          onClick={handleClose}
        />
      </div>
    );
  },
);
TitleBar.displayName = "TitleBar";
