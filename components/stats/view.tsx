import clsx from "clsx";
import { ReactNode, memo } from "react";

import { ChatIcon, ClockIcon, CloudUploadIcon, HeartIcon } from "@heroicons/react/outline";

export const Stats = () => {
  return (
    <section className="grid grid-cols-4 rounded shadow-lg">
      <StatCard
        title="прослушано"
        value="3 часа"
        desc="прослушено треков"
        className="bg-gradient-to-br  from-blue-600 to-blue-300 text-white  duration-150 hover:from-blue-300 hover:to-blue-600"
        icon={<ClockIcon className="h-10 w-10" />}
      />

      <StatCard
        title="загруженно треков"
        value="10"
        desc="опубликованно треков"
        className="bg-gradient-to-tr from-purple-300 to-sky-600 text-white hover:from-sky-600 hover:to-purple-600"
        icon={<CloudUploadIcon className="h-10 w-10" />}
      />
      <StatCard
        title="избранное"
        value="150"
        desc="добавлено в избранное"
        className=" row-span-2 bg-gradient-to-br from-emerald-300 to-teal-600 text-white hover:from-teal-600 hover:to-emerald-300"
        icon={<HeartIcon className="h-10 w-10" />}
      />
      <StatCard
        title="прослушано"
        value="3 часа"
        desc="прослушено треков"
        className="row-span-2 bg-gradient-to-br  from-yellow-300 to-amber-600 text-white  duration-150 hover:from-amber-600 hover:to-yellow-300"
        icon={<ClockIcon className="h-10 w-10" />}
      />

      <StatCard
        title="загруженно треков"
        value="10"
        desc="опубликованно треков"
        className="bg-gradient-to-tr from-fuchsia-600 to-pink-300 text-white hover:from-pink-300 hover:to-fuchsia-600"
        icon={<CloudUploadIcon className="h-10 w-10" />}
      />

      <StatCard
        title="комментариев"
        value="150"
        className="bg-gradient-to-br from-rose-300 to-orange-600 text-white hover:from-orange-600 hover:to-rose-300"
        icon={<ChatIcon className="h-10 w-10" />}
      />
    </section>
  );
};

interface StatCardProps {
  icon?: ReactNode;
  title?: string;
  desc?: string;
  className?: string;
  value?: ReactNode;
}

const StatCard = memo<StatCardProps>(({ desc, icon, title, value, className }) => {
  return (
    <figure className={clsx("group stat", className)}>
      <div className="stat-figure group-hover:animate-pulse">{icon}</div>
      <h3 className="stat-title">{title}</h3>
      <span className="stat-value">{value}</span>
      <p className="stat-desc">{desc}</p>
    </figure>
  );
});

StatCard.displayName = "StatCard";
