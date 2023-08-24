import { useEvent } from "effector-react/scope";
import { useEffect } from "react";

import { destroyWinamp, initWinamp } from "~/widgets/winamp";

export const useInitPlayer = () => {
  const [init, destroy] = useEvent([initWinamp, destroyWinamp]);

  useEffect(() => {
    init();
    return () => {
      destroy();
    };
  }, []);
};
