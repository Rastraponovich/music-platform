import clsx from "clsx"
import { memo, ReactNode } from "react"

interface StatCardInputProps {
    icon?: ReactNode
    title?: string
    desc?: string
    className?: string
    value?: string | number | ReactNode | boolean
}

const StatCard = ({ desc, icon, title, value, className }: StatCardInputProps) => {
    return (
        <div className={clsx("group stat", className)}>
            <div className="stat-figure group-hover:animate-pulse">{icon}</div>
            <h3 className="stat-title">{title}</h3>
            <span className="stat-value">{value}</span>
            <p className="stat-desc">{desc}</p>
        </div>
    )
}

export default memo(StatCard)
