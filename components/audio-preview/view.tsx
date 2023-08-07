import { memo } from "react";

interface AudioPreviewProps {
  audio: File;
}

export const AudioPreview = memo<AudioPreviewProps>(({ audio }) => {
  return (
    <div className="relative scale-75 self-start">
      <audio controls src={URL.createObjectURL(audio)} className="absolute left-0" />
    </div>
  );
});
AudioPreview.displayName = "AudioPreview";
