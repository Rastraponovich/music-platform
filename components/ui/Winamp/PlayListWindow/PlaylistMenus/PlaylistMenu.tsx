import { useOnClickAway } from "@/hooks/useOnClickAway";
import clsx from "clsx";
import React, { memo, ReactNode, useCallback, useState, Children } from "react";
import PlaylistMenuEntry from "./PlaylistMenuEntry";

interface PlaylistMenuProps {
  id: string;
  children: ReactNode | Array<ReactNode>;
}

const PlaylistMenu = ({ id, children }: PlaylistMenuProps) => {
  const [selected, setSelected] = useState(false);

  const [ref, setRef] = useState<Element | null>(null);

  const callback = useCallback(() => {
    // If we've clicked on a Context Menu spawed inside this menu, it will
    // register as an external click. However, hiding the menu will remove
    // the Context Menu from the DOM. Therefore, we wait until the next
    // event loop to actually hide ourselves.
    setTimeout(() => {
      // Close the menu
      setSelected(false);
    }, 0);
  }, []);

  useOnClickAway(ref, selected ? callback : null);
  return (
    <div
      id={id}
      className={clsx("playlist-menu", {
        selected,
      })}
      ref={setRef}
      onClick={() => setSelected((prev) => !prev)}
    >
      <div className="bar" />
      {selected && (
        <ul className="absolute top-[-34px] left-px  z-50 flex  h-[54px] w-[22px] flex-col">
          {Children.map(children, (child, i) => (
            <PlaylistMenuEntry key={i}>{child}</PlaylistMenuEntry>
          ))}
        </ul>
      )}
    </div>
  );
};

export default memo(PlaylistMenu);
