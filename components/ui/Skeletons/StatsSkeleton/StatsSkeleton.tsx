import { StatCardSkeleton } from ".."

export const StatsSkeleton = () => {
    return (
        <section className="grid grid-cols-4 rounded shadow-lg">
            <StatCardSkeleton />
            <StatCardSkeleton />

            <StatCardSkeleton className="row-span-2" />
            <StatCardSkeleton className="row-span-2" />

            <StatCardSkeleton />
            <StatCardSkeleton />
        </section>
    )
}
