import { ChangeEventHandler, forwardRef } from "react";

interface TrackProgressProps {
  currentValue: number;
  maxValue: number | string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const TrackProgress = forwardRef<HTMLInputElement, TrackProgressProps>(
  ({ currentValue, maxValue, onChange }, ref) => {
    return (
      <label className="flex flex-col">
        <input
          min={0}
          ref={ref}
          type="range"
          max={maxValue}
          onChange={onChange}
          value={currentValue}
          title={`{currentValue} / {maxValue}`}
        />
        <span title={`{currentValue} / {maxValue}`}>
          {currentValue} / {maxValue}
        </span>
      </label>
    );
  },
);

TrackProgress.displayName = "TrackProgress";
