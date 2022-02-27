import { Nullable } from "@/types"
import { tarifCards } from "@/utils/__mock__"
import { useMemo, useState } from "react"
import TarifCard from "./TarifCard"

const Tarifs = () => {
    const memoTarifs = useMemo(() => tarifCards, [tarifCards])

    const [checked, setChecked] = useState<Nullable<number>>(null)

    return (
        <section className="flex flex-col  bg-white px-20 py-10">
            <h2 className="mb-4 text-3xl font-bold first-letter:uppercase">тарифы</h2>
            <div className="sm:gird-cols-1 grid gap-4 md:grid-cols-3">
                {memoTarifs.map((tarif) => (
                    <TarifCard
                        key={tarif.id}
                        tarif={tarif}
                        setChecked={setChecked}
                        checked={checked === tarif.id}
                    />
                ))}
            </div>
        </section>
    )
}

export default Tarifs
