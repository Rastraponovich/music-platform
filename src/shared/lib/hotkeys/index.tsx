import {
  useChangeCurentTime,
  useChangeCurrentVolume,
} from "@/src/shared/hooks/use-change-current-time";

import type { ReactNode } from "react";

interface HotkeysProps {
  children: ReactNode;
}

export const Hotkeys = ({ children }: HotkeysProps) => {
  const useChangeCurentTimeHook = useChangeCurentTime();
  const useChangeCurrentVolumeHook = useChangeCurrentVolume();

  return <>{children}</>;
};
