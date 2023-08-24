import clsx from "clsx";
import { Children, ReactNode, memo, useCallback, useState } from "react";

import { useIsHovered } from "~/shared/hooks/use-hovered";
import { useOnClickAway } from "~/shared/hooks/use-onclick-away";
import { WinampButton } from "~/shared/ui/winamp/winamp-button";

interface PlaylistMenuProps {
  id: string;
  children: ReactNode | ReactNode[];
}

export const PlaylistMenu = memo<PlaylistMenuProps>(({ id, children }) => {
  const [selected, setSelected] = useState(false);

  const [ref, setRef] = useState<Element | null>(null);

  // If we've clicked on a Context Menu spawed inside this menu, it will
  // register as an external click. However, hiding the menu will remove
  // the Context Menu from the DOM. Therefore, we wait until the next
  // event loop to actually hide ourselves.
  const callback = useCallback(() => {
    setTimeout(() => {
      setSelected(false); // Close the menu
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
            <PlaylistMenuContructor key={i}>{child}</PlaylistMenuContructor>
          ))}
        </ul>
      )}
    </div>
  );
});

PlaylistMenu.displayName = "PlaylistMenu";

interface PlaylistMenuContructorProps {
  children: ReactNode;
}

const PlaylistMenuContructor = memo<PlaylistMenuContructorProps>(({ children }) => {
  const { ref, hover } = useIsHovered();

  return (
    <li ref={ref} className={clsx({ hover }, "h-[18px]")}>
      {children}
    </li>
  );
});

PlaylistMenuContructor.displayName = "PlaylistMenuContructor";

export const OptionMenu = () => {
  return (
    <div className="relative ml-[7px]">
      <PlaylistMenu id="list-option">
        <WinampButton id="new-list" className=" h-[18px] w-[22px] cursor-winamp" />
        <WinampButton id="save-list" className=" h-[18px] w-[22px] cursor-winamp" />
        <WinampButton id="load-list" className=" h-[18px] w-[22px] cursor-winamp" />
      </PlaylistMenu>
    </div>
  );
};

export const MiscMenu = () => (
  <PlaylistMenu id="playlist-misc-menu">
    <div className="sort-list" onClick={(e) => e.stopPropagation()}>
      {/* <SortContextMenu /> */}
    </div>
    <div className="file-info" onClick={() => alert("Not supported in Webamp")} />

    <div className="misc-options" onClick={(e) => e.stopPropagation()}>
      {/* <MiscOptionsContextMenu /> */}
    </div>
  </PlaylistMenu>
);

export const AddMenu = () => {
  return (
    <div className="relative ">
      <PlaylistMenu id="list-option">
        <WinampButton id="new-list" className=" h-[18px] w-[22px] cursor-winamp" />
        <WinampButton id="save-list" className=" h-[18px] w-[22px] cursor-winamp" />
        <WinampButton id="load-list" className=" h-[18px] w-[22px] cursor-winamp" />
      </PlaylistMenu>
    </div>
  );
};
