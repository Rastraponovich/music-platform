export const AccordionSkeleton = () => {
    return (
        <div className="flex h-10 w-full  animate-pulse justify-between rounded bg-white py-2 px-4">
            <div className="flex space-x-2">
                <span className="h-6 w-6 rounded-full bg-gray-300"></span>
                <span className="h-full w-40 rounded bg-gray-300"></span>
            </div>
            <span className="h-5 w-5 rounded bg-gray-300"></span>
        </div>
    )
}
