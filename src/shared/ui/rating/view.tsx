import { memo } from "react";

interface RatingProps {
  value: number;
}

export const Rating = memo<RatingProps>(({ value }) => {
  return (
    <label className="rating rating-sm items-center">
      {["1", "2", "3", "4", "5"].map((ratingStar) => (
        <input
          type="radio"
          name="rating-2"
          key={ratingStar}
          checked={value.toString() === ratingStar}
          className="mask mask-star-2  bg-orange-400"
        />
      ))}
    </label>
  );
});

Rating.displayName = "Rating";
