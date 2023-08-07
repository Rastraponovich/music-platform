import { useIsHovered } from "@/src/shared/hooks/use-hovered";
import clsx from "clsx";
import React, { memo, ReactNode } from "react";

interface PlaylistMenuEntryProps {
  children: ReactNode;
}

const PlaylistMenuEntry = ({ children }: PlaylistMenuEntryProps) => {
  const { ref, hover } = useIsHovered();

  return (
    <li ref={ref} className={clsx({ hover }, "h-[18px]")}>
      {children}
    </li>
  );
};

export default memo(PlaylistMenuEntry);
