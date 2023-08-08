import clsx from "clsx";
import { useList, useUnit } from "effector-react";
import React, { memo } from "react";

import { TPreset } from "@/features/music/types";
import { eq } from "@/src/widgets/winamp/model";

interface PresetProps {
  preset: TPreset;
}

/**
 * @todo semantic refactor
 */
const Preset = memo<PresetProps>(({ preset }) => {
  const [selected, handleSelectPreset] = useUnit([eq.$selectedPreset, eq.selectPreset]);

  return (
    <div
      className={clsx(
        "lowercase first-letter:uppercase ",
        selected?.name === preset.name && "bg-[#0078d7] text-white",
      )}
      onClick={() => handleSelectPreset(preset)}
    >
      {preset.name}
    </div>
  );
});

Preset.displayName = "Preset";

export const PresetsList = () => {
  const selectedPreset = useUnit(eq.$selectedPreset);

  return (
    <div className="flex flex-col  overflow-y-scroll border-[0.5px] border-[#828790] bg-white p-px">
      {useList(eq.$presets, {
        keys: [selectedPreset],
        fn: (preset) => <Preset preset={preset} />,
      })}
    </div>
  );
};
