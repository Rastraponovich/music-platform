import * as React from "react";
import { Scope, fork, serialize } from "effector";

let clientScope: Scope;

const initializeScope = (initialData: Record<string, unknown>) => {
  const scope = fork({
    values: {
      ...(clientScope ? serialize(clientScope) : {}),
      ...initialData,
    },
  });

  if (typeof window !== "undefined") {
    clientScope = scope;
  }

  return scope;
};

export const useScope = (initialData = {}) =>
  React.useMemo(() => initializeScope(initialData), [initialData]);

export const getClientScope = (): Scope | undefined => clientScope;
