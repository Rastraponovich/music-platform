import { useUnit } from "effector-react";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";

import { changeWindowState } from "~/widgets/winamp";


import { DEFALUT_WINDOW_STATE } from "~/entity/songs";
import type { UseDraggblePosition, UseDraggbleReturnProps, WinampWindow } from "~/entity/songs/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDraggable = (WINDOW_NAME: WinampWindow, ref: any): UseDraggbleReturnProps => {
  const handleActiveWindow = useUnit(changeWindowState);

  const position = useMemo(() => {
    return <UseDraggblePosition>DEFALUT_WINDOW_STATE[WINDOW_NAME];
  }, [WINDOW_NAME]);

  useEffect(() => {
    ref.current.style.left = position.clientX + "px";
    ref.current.style.top = position.clientY + "px";
  }, [position.clientX, position.clientY, ref]);

  const [diff, setDiff] = useState({
    diffX: 0,
    diffY: 0,
  });

  const [allowDragging, setAllowDragging] = useState<boolean>(false);

  const onDragStart = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      handleActiveWindow(WINDOW_NAME); //   setPicked(true);
      e.preventDefault();
      setDiff({
        diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
        diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
      });
      setAllowDragging(true);
    },
    [handleActiveWindow, WINDOW_NAME],
  );

  const onDragging = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (allowDragging) {
        const left = e.screenX - diff.diffX;
        const top = e.screenY - diff.diffY;

        // if (e.pageX === 0) {
        //     return setTimeout(() => {
        //         setPosition({ ...position, clientX: 0 })
        //     }, 500)
        // }

        // setPosition({ ...position, clientX: left, clientY: top })
        ref.current.style.left = left + "px";
        ref.current.style.top = top + "px";
      }
    },
    [allowDragging, diff.diffX, diff.diffY, ref],
  );
  const onDragEnd = useCallback(() => setAllowDragging(false), []);

  return [onDragStart, onDragging, onDragEnd];
};
