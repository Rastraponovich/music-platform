import { useChangeCurentTime } from "@/hooks/useChangeCurrentTime";

import type { ReactNode } from "react";

interface HotkeysProps {
  children: ReactNode;
}

export const Hotkeys = ({ children }: HotkeysProps) => {
  const useChangeCurentTimeHook = useChangeCurentTime();

  return <>{children}</>;
};
