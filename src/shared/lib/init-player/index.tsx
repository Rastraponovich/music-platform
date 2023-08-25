import type { ReactNode } from "react";

import { useInitPlayer } from "~/shared/hooks/use-init-player";

interface InitPlayerProps {
  children: ReactNode;
}

export const InitPlayer = ({ children }: InitPlayerProps) => {
  useInitPlayer();

  return <>{children}</>;
};
