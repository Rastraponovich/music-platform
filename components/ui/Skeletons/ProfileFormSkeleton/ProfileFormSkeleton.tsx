export const ProfileFormSkeleton = () => {
    return (
        <section className="grid grid-cols-1 gap-y-4 bg-gray-200 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-0">
            <div className="avatar indicator w-full animate-pulse flex-col items-center justify-center self-start rounded bg-gray-200 p-4 shadow-md ">
                <span className="badge indicator-item h-5 w-20 border-gray-400 bg-gray-400 drop-shadow-md"></span>

                <span className="h-48 max-h-52 w-24 rounded-full bg-gray-300 md:w-48 "></span>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <span className="h-full max-h-12 w-full max-w-[200px] rounded bg-gray-300"></span>
            </div>
        </section>
    )
}
