import { useEvent } from "effector-react/scope";
import { useEffect } from "react";

import { winamp } from "@/src/widgets/winamp/model";

export const useInitPlayer = () => {
  const [init, destroy] = useEvent([winamp.init, winamp.destroy]);

  useEffect(() => {
    init();
    return () => {
      destroy();
    };
  }, []);
};
