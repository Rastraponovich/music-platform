import clsx from "clsx";
import { memo, MouseEvent } from "react";
import { useEvent } from "effector-react";
import { useMinimized, useWindowState } from "../model/selectors";
import { actions } from "../model";

interface EQHeaderProps {
  onMouseDown: (e: MouseEvent<HTMLElement>) => void;
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseUp: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: MouseEvent<HTMLElement>) => void;
}

const WINDOW_NAME = "EQUALIZER";

export const EQHeader = memo(
  ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: EQHeaderProps) => {
    const minimized = useMinimized();
    const windowState = useWindowState();

    const handleMinimizedButtonClicked = useEvent(actions.toggleMinimized);
    const handleCloseEQButtonClicked = useEvent(actions.closeEQ);

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
          onClick={handleMinimizedButtonClicked}
        />
        <button
          id="equalizer-close"
          className="h-3.5 w-3.5 cursor-winamp-move"
          onClick={handleCloseEQButtonClicked}
        />
      </div>
    );
  },
);
EQHeader.displayName = "EQHeader";
