import { useInitPlayer } from "@/src/shared/hooks/use-init-player";

import type { ReactNode } from "react";

interface InitPlayerProps {
  children: ReactNode;
}

export const InitPlayer = ({ children }: InitPlayerProps) => {
  useInitPlayer();

  return <>{children}</>;
};
