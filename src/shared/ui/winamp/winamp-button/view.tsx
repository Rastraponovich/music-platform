import clsx from "clsx";
import { memo, useState } from "react";

import { DEFAULT_MINI_ACTION_BUTTON_STYLE } from "./constants";

interface WinampButtonProps {
  id: string;
  title?: string;
  small?: boolean;
  active?: boolean;
  onClick?(): void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const WinampButton = memo<WinampButtonProps>(
  ({ id, className, onClick, title, active, small = false, type = "button" }) => {
    const [pressed, setPressed] = useState(false);

    const handleClick = () => setPressed((prev) => !prev);
    const hanldeMouseLeave = () => setPressed(false);

    return (
      <button
        id={id}
        type={type}
        title={title}
        onClick={onClick}
        onMouseUp={handleClick}
        onMouseDown={handleClick}
        onMouseLeave={hanldeMouseLeave}
        className={clsx(
          className,
          active && "active",
          pressed && "clicked",
          small && DEFAULT_MINI_ACTION_BUTTON_STYLE,
        )}
      />
    );
  },
);
WinampButton.displayName = "WinampButton";
