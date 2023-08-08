import { useStore } from "effector-react";

import { $comments } from "./model";

export const useComments = (id: number) => useStore($comments)[id];
