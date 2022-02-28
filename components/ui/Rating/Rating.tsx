import clsx from "clsx"
import React, { memo, FC } from "react"

interface RatingProps {
    value: number
}

const Rating = ({ value }: RatingProps) => {
    return (
        <div className="rating">
            {["1", "2", "3", "4", "5"].map((ratingStar) => (
                <input
                    key={ratingStar}
                    type="radio"
                    name="rating-2"
                    checked={value.toString() === ratingStar}
                    className={clsx("mask mask-star-2 bg-orange-400")}
                />
            ))}
        </div>
    )
}

export default memo(Rating)
