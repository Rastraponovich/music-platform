import type { ReactNode } from "react";

import { useInitPlayer } from "@/src/shared/hooks/use-init-player";

interface InitPlayerProps {
  children: ReactNode;
}

export const InitPlayer = ({ children }: InitPlayerProps) => {
  useInitPlayer();

  return <>{children}</>;
};
