export const TrackSkeletonSmall = () => {
    return (
        <div className="group relative flex flex-col overflow-hidden shadow-sm duration-200 ">
            <div className="z-20 grid animate-pulse grid-cols-12 items-center rounded bg-white py-2 px-1 group-hover:bg-gray-200 md:pr-2 ">
                <span className="col-span-1 h-8 w-8 justify-self-start rounded-full bg-gray-300   md:justify-self-center"></span>
                <div className="col-span-8 flex items-center space-x-2 md:col-span-10">
                    <div className="relative h-5 w-5 rounded bg-gray-300 md:h-10 md:w-10"></div>

                    <div className=" flex h-6 grow flex-col justify-center   text-xs md:flex-row md:justify-start md:text-base">
                        <span className="  w-4/6 rounded bg-gray-300"></span>
                    </div>
                </div>
                <div className="col-span-1 col-start-12  flex flex-col justify-self-end  md:col-start-13 md:flex-row md:text-sm">
                    <span className="h-6 w-16 rounded bg-gray-300"></span>
                </div>
            </div>
        </div>
    )
}
