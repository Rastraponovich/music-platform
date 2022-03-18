import { Tarif } from "@/types"
import { BadgeCheckIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { memo, useMemo, useState } from "react"
import Button from "../ui/Button/Button"

interface TarifCardProps {
    tarif: Tarif
    checked: boolean
    setChecked: (id: number) => void
}

const TarifCard = ({ tarif, checked, setChecked }: TarifCardProps) => {
    return (
        <div
            className={clsx(
                "group flex flex-col justify-between space-y-4 rounded bg-gray-200 p-4 text-gray-900 shadow-sm duration-150 hover:text-white hover:shadow-lg",
                tarif.recomended && "indicator w-full",
                tarif.level === "standard" && " hover:bg-yellow-500",
                tarif.level === "start" && "hover:bg-blue-400",
                tarif.level === "super" && " hover:bg-green-600"
            )}
        >
            {tarif.recomended && (
                <span className="indicator-center indicator-item badge animate-pulse border-green-500 bg-green-500 group-hover:border-green-600 group-hover:bg-green-600 group-hover:shadow-xl md:indicator-end md:indicator-top">
                    рекомендуется
                </span>
            )}
            <h3 className="text-2xl font-normal">{tarif.name}</h3>
            <p className="grow">{tarif.terms}</p>
            <span className="text-2xl font-bold before:content-['$']">{tarif.price}</span>
            <Button
                className="btn-outline btn-md  rounded border-gray-400 group-hover:btn group-hover:rounded"
                onClick={() => setChecked(tarif.id)}
            >
                {checked && <BadgeCheckIcon className="h-6 w-6 text-green-600" />}
                <span>{checked ? "ты пидор" : "стать пидором"}</span>
            </Button>
        </div>
    )
}

export default memo(TarifCard)
