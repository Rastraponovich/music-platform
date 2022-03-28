import clsx from "clsx"
import { memo } from "react"

interface StatCardSkeletonProps {
    className?: string
    iconClassName?: string
}

export const StatCardSkeleton = memo(({ className, iconClassName }: StatCardSkeletonProps) => {
    return (
        <div className={clsx("stat animate-pulse bg-gray-200", className)}>
            <div
                className={clsx("stat-figure  h-10 w-10 rounded-full bg-gray-500", iconClassName)}
            ></div>
            <h3 className="stat-title my-1 rounded bg-gray-500"></h3>
            <span className="stat-value my-1 rounded bg-gray-500"></span>
            <p className="stat-desc my-1 rounded bg-gray-500"></p>
        </div>
    )
})
