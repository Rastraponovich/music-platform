import { useInitPlayer } from "@/hooks/useInitPlayer";

import type { ReactNode } from "react";

interface InitPlayerProps {
  children: ReactNode;
}

export const InitPlayer = ({ children }: InitPlayerProps) => {
  useInitPlayer();

  return <>{children}</>;
};
