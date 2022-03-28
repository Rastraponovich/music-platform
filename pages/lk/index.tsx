import ProfileForm from "@/components/ProfileForm/ProfileForm"
import TrackListItemSmall from "@/components/TrackListItem/TrackListItemSmall"
import AccordionFilter from "@/components/ui/AccordionFilter/AccordionFilter"
import Button from "@/components/ui/Button/Button"
import { Stats } from "@/components/Stats/Stats"
import { winamp } from "@/features/media/winamp"
import { $songs, getSongs } from "@/features/music"
import { BookOpenIcon, AnnotationIcon, MusicNoteIcon, NewspaperIcon } from "@heroicons/react/solid"
import { allSettled, fork, serialize } from "effector"
import { useList, useStore } from "effector-react"
import { GetServerSideProps, NextPage } from "next"
import { useCallback, useState } from "react"
import { TrackSkeletonSmall } from "@/components/ui/Skeletons/TrackSkeleton/TrackSkeletonSmall"
import { AccordionSkeleton } from "@/components/ui/Skeletons/AccordionSkeleton/AccordionSkeleton"
import {
    AccordionFiltersSkeleton,
    LKFiltersSkeleton,
    ProfileFormSkeleton,
    StatsSkeleton,
} from "@/components/ui/Skeletons"

interface LKPageProps {}

const LKPage: NextPage<LKPageProps> = () => {
    const currentTrack = useStore(winamp.$currentTrack)
    return (
        <main className="grow space-y-4 bg-gray-100 px-5 pb-5 pt-1 md:px-20 md:pt-2 ">
            <h2 className="text-center text-xl font-semibold first-letter:uppercase sm:text-left sm:text-2xl">
                личный кабинет
            </h2>

            {/* <ProfileForm /> */}
            <ProfileFormSkeleton />

            {/* <Stats /> */}
            <StatsSkeleton />
            <LKFiltersSkeleton />
            {/* <section className="flex space-x-2 rounded bg-white p-2 text-sm">
                <Button className="text-xs">избранное</Button>
                <Button className="text-xs">загруженные треки</Button>
            </section> */}
            <AccordionFiltersSkeleton />

            {/* <section className="grid grid-cols-1  xl:grid xl:grid-cols-3 xl:items-start xl:gap-2">
                <AccordionFilter
                    title={
                        <div className="flex space-x-2">
                            <NewspaperIcon className=" h-6 w-6" />
                            <span className="first-letter:uppercase">плейлисты - 115</span>
                        </div>
                    }
                >
                    <div>пусто</div>
                </AccordionFilter>
                <AccordionFilter
                    className="col-span-1 xl:col-span-2"
                    divider
                    title={
                        <div className="flex space-x-2">
                            <MusicNoteIcon className=" h-6 w-6" />
                            <span className="first-letter:uppercase">треки - 6</span>
                        </div>
                    }
                >
                    {useList($songs, {
                        keys: [currentTrack],
                        fn: (song) => (
                            <TrackListItemSmall
                                track={song}
                                isCurrentTrack={currentTrack?.id === song.id}
                            />
                        ),
                    })}
                </AccordionFilter>
                <AccordionFilter
                    title={
                        <div className="flex space-x-2">
                            <AnnotationIcon className=" h-6 w-6" />
                            <span className="first-letter:uppercase">комментарии - 10</span>
                        </div>
                    }
                >
                    <div>пусто</div>
                </AccordionFilter>
                <AccordionFilter
                    title={
                        <div className="flex space-x-2">
                            <BookOpenIcon className=" h-6 w-6" />
                            <span className="first-letter:uppercase">альбомы - 15</span>
                        </div>
                    }
                >
                    <div>пусто</div>
                </AccordionFilter>
            </section> */}
        </main>
    )
}

export default LKPage

export const getServerSideProps: GetServerSideProps = async () => {
    const scope = fork()

    await allSettled(getSongs, { scope })

    return {
        props: {
            initialState: serialize(scope),
        },
    }
}
