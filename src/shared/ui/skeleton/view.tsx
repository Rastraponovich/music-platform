import clsx from "clsx";
import { memo } from "react";

export const AccordionSkeleton = () => {
  return (
    <div className="flex h-10 w-full  animate-pulse justify-between rounded bg-white py-2 px-4">
      <div className="flex space-x-2">
        <span className="h-6 w-6 rounded-full bg-gray-300"></span>
        <span className="h-full w-40 rounded bg-gray-300"></span>
      </div>
      <span className="h-5 w-5 rounded bg-gray-300"></span>
    </div>
  );
};

export const AccordionFiltersSkeleton = () => {
  return (
    <section className="grid grid-cols-1 gap-2">
      <AccordionSkeleton />
      <AccordionSkeleton />
      <AccordionSkeleton />
      <AccordionSkeleton />
    </section>
  );
};

export const AvatarSkeleton = () => {
  return <div className="h-12 w-12 animate-pulse rounded-full bg-gray-300"></div>;
};

export const LKFiltersSkeleton = () => {
  return (
    <section className="flex space-x-2 rounded bg-white p-2 ">
      <span className="h-12 w-36 animate-pulse rounded bg-gray-300"></span>
      <span className=" h-12 w-56 animate-pulse rounded bg-gray-300"></span>
    </section>
  );
};

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
  );
};

interface StatCardSkeletonProps {
  className?: string;
  iconClassName?: string;
}

export const StatCardSkeleton = memo(({ className, iconClassName }: StatCardSkeletonProps) => {
  return (
    <div className={clsx("stat animate-pulse bg-gray-200", className)}>
      <div className={clsx("stat-figure  h-10 w-10 rounded-full bg-gray-500", iconClassName)}></div>
      <h3 className="stat-title my-1 rounded bg-gray-500"></h3>
      <span className="stat-value my-1 rounded bg-gray-500"></span>
      <p className="stat-desc my-1 rounded bg-gray-500"></p>
    </div>
  );
});

StatCardSkeleton.displayName = "StatCardSkeleton";

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
  );
};

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
  );
};
