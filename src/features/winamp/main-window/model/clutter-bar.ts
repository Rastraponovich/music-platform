import { createEvent, sample } from "effector";

import { changeClutterBar } from "@/src/widgets/winamp";

export const changedClutterBar = createEvent<string>();

sample({
  clock: changedClutterBar,
  target: changeClutterBar,
});
