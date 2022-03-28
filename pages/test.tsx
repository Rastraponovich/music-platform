import Layout from "@/components/ui/Layout/Layout"
import { useEffect, useState } from "react"

const TestPage = () => {
    const [data, setData] = useState<any>(null)

    const fetchData = async () => {
        const request = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")

        const result = await request.json()

        setData(result)
    }

    console.log(data)

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <main className="grow space-y-2 px-10 py-5">
            <div>{data?.Timestamp}</div>
            <div className="relative grid grid-cols-3 gap-2 p-2">
                {data !== null &&
                    Object.entries(data?.Valute).map(([key, val]: [string, any]) => (
                        <div
                            key={val.ID}
                            className="flex justify-between rounded bg-white p-2 text-sm drop-shadow-lg duration-150  hover:bg-indigo-300 hover:text-white"
                        >
                            <span>{val.Name}</span>
                            <span>{val.Value}</span>
                        </div>
                    ))}
            </div>
        </main>
    )
}

export default TestPage
