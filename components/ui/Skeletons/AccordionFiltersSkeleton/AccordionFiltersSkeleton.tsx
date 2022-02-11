import { AccordionSkeleton } from ".."

export const AccordionFiltersSkeleton = () => {
    return (
        <section className="grid grid-cols-1 gap-2">
            <AccordionSkeleton />
            <AccordionSkeleton />
            <AccordionSkeleton />
            <AccordionSkeleton />
        </section>
    )
}
